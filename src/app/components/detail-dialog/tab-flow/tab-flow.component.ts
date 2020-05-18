import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import * as moment from 'moment';
import { MesagesData } from '../tab-messages/tab-messages.component';
import { Functions } from '@app/helpers/functions';
// import * as html2canvas from 'html2canvas';

@Component({
    selector: 'app-tab-flow',
    templateUrl: './tab-flow.component.html',
    styleUrls: ['./tab-flow.component.css']
})
export class TabFlowComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('flowtitle', {static: false}) flowtitle;
    _isSimplify = false;

    @Input()
    set isSimplify(val: boolean) {
        this._isSimplify = val;
    }
    get isSimplify() {
        return this._isSimplify;
    }

    _isSimplifyPort = false;
    _flagAfterViewInit = false;
    @Input()
    set isSimplifyPort(val: boolean) {
        this._isSimplifyPort = val;
    }
    get isSimplifyPort() {
        return this._isSimplifyPort;
    }

    @Input() callid: any;
    _dataItem: any;
    @Input() set dataItem(val) {
        this._dataItem = val;
        setTimeout(this.initData.bind(this));
    }
    get dataItem () {
        return this._dataItem;
    }
    @Input() set exportAsPNG(val) {
        if (val) {
            this.isExport = true;
            setTimeout(() => {
                this.onSavePng();
            }, 500);
        }
    }
    @Output() messageWindow: EventEmitter<any> = new EventEmitter();

    @ViewChild('flowpage', {static: true}) flowpage: ElementRef;
    @ViewChild('flowscreen', {static: true}) flowscreen: ElementRef;
    // </div>
    @ViewChild('canvas', {static: true}) canvas: ElementRef;
    @ViewChild('downloadLink', {static: true}) downloadLink: ElementRef;
    isExport = false;
    aliasTitle: Array<any>;
    dataSource: Array<MesagesData> = [];
    arrayItems: Array<any>;
    color_sid: string;
    _interval: any;
    labels: Array<any> = [];

    constructor() { }

    ngAfterViewInit() {
        const self = this;
        if (!this._interval) {
            this._interval = setInterval(() => {
                try {
                    const wftc = self.flowpage.nativeElement.parentElement.parentElement;
                    self.flowtitle.nativeElement.style.left = -wftc.scrollLeft + 'px';
                } catch (e) { }
            } , 20); // 60 fps
        }

        this._flagAfterViewInit = true;
    }
    ngOnDestroy () {
        clearInterval(this._interval);
    }
    ngOnInit() {
        this.initData();
    }
    initData() {
        this.color_sid = Functions.getColorByString(this.callid);

        const IpList = ([].concat(...this.dataItem.data.calldata.map(i => [i.srcId, i.dstId]))).reduce((a, b) => {
            if (!a.includes(b)) {
                a.push(b);
            }
            return a;
        }, []);

        let hosts = Functions.cloneObject(this.dataItem.data.hosts);

        /* sort it */
        hosts = this.sortProperties(hosts, 'position', true, false);

        let increment = 0;
        Object.keys(hosts).map(i => {
            if (!IpList.includes(i)) {
                delete hosts[i];
            } else {
                hosts[i].position = increment;
                increment++;
            }
        });

        this.aliasTitle = Object.keys(hosts).map( i => {
            const alias = this.dataItem.data.alias[i];
            // This is where the GUI splits port from IP Address. 
            //Note: not perfect. It works 'backwards' from the end of the string
            //If last IPv6 block has letters and digits, and there is no port, then
            // the regexp will fail, and result in null. This is a 'best' effort
            const regex = RegExp('(.*(?!$))(?::)([0-9]+)?$');
            if(regex.exec(i) != null){
                var IP    = regex.exec(i)[1] // gives IP
                if(IP.indexOf(':') > 0 ) {
                    //got an IPv6
                    //pre+suffix [ IPv6 ] to make addr:port delineation clearer
                    IP = '[' + IP + ']'
                }
                var PORT  = regex.exec(i)[2] // gives port
                PORT = PORT ? ":" + PORT : ''
                return { ip: i, alias, IP, PORT };
            } else {
                //fall back to the old method if things don't work out.
                const al    = i.split(':');
                const IP    = al[0];
                const PORT  = al[1] ? ':' + al[1] : '';
                return { ip: i, alias, IP, PORT };
            }

        });
        const colCount = this.aliasTitle.length;
        const data = this.dataItem.data;
        let diffTs = 0;
        this.labels = data.calldata.map(i => i.sid).reduce((a, b) => {
            if (a.indexOf(b) === -1) {
                a.push(b);
            }
            return a;
        }, []).map(i => {
            return {
                color_sid: Functions.getColorByString(i),
                callid: i
            }
        });
        this.arrayItems = data.calldata.map((item, key, arr) => {
            diffTs = key - 1 >= 0 && arr[key - 1] !== null ? (item.micro_ts - arr[key - 1].micro_ts) / 1000 : 0;

            const srcPosition = hosts[item.srcId].position;
            const dstPosition = hosts[item.dstId].position;
            const course = srcPosition < dstPosition ? 'right' : 'left';
            const positionFrom = Math.min(srcPosition, dstPosition);
            const positionWidth = Math.abs(srcPosition - dstPosition);
            const colorMethod = Functions.getColorByString(item.method_text);

            return {
                course,
                method_text: item.method_text,
                ruri_user: item.ruri_user,
                id: item.id,
                color_method: colorMethod,
                color: Functions.getColorByString(item.sid),
                micro_ts: moment( item.micro_ts).format('YYYY-MM-DD HH:mm:ss.SSS Z'),
                diffTs: diffTs.toFixed(3),
                proto: Functions.protoCheck(item.protocol),
                style: {
                    left: positionFrom / colCount * 100,
                    width: positionWidth / colCount * 100
                }
            };
        });
        this.dataSource = Functions.messageFormatter(this.dataItem.data.messages);
    }

    onClickItem(id: any, event = null) {
        const row: any = this.dataSource.filter(i => i.id === id)[0];
        row.mouseEventData = event;
        this.messageWindow.emit(row);
    }

    sortProperties(obj: any, sortedBy: any = 1, isNumericSort = false, reverse = false) {
        const reversed = (reverse) ? -1 : 1;
        const sortable = [];

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                sortable.push([key, obj[key]]);
            }
        }
        if (isNumericSort) {
            sortable.sort((a, b) => {
                return reversed * (a[1][sortedBy] - b[1][sortedBy]);
            });
        } else {
            sortable.sort((a, b) => {
                const x = a[1][sortedBy].toLowerCase();
                const y = b[1][sortedBy].toLowerCase();
                return x < y ? reversed * -1 : x > y ? reversed : 0;
            });
        }

        return sortable.reduce((target, item) => {
            target[item[0]] = item[1];
            return target;
        }, {});
    }

    onSavePng() {
        // if (!this._flagAfterViewInit) {
        //     console.log('waiting FLOW before save a PNG');
        //     setTimeout(this.onSavePng.bind(this), 1000);
        //     return;
        // }
        // if (html2canvas && typeof html2canvas === 'function') {
        //     const f: Function = html2canvas as Function;
        //     f(this.flowscreen.nativeElement).then(canvas => {
        //         this.canvas.nativeElement.src = canvas.toDataURL();
        //         this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
        //         this.downloadLink.nativeElement.download = `${this.callid}.png`;
        //         this.downloadLink.nativeElement.click();
        //     });
        // }
    }
}
