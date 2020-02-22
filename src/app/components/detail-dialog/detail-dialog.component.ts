import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Functions } from 'src/app/helpers/functions';

@Component({
    selector: 'app-detail-dialog',
    templateUrl: './detail-dialog.component.html',
    styleUrls: ['./detail-dialog.component.css']
})
export class DetailDialogComponent implements OnInit {
    @Input() titleId: string;
    @Input() sipDataItem: any;
    @Input() mouseEventData: any;
    tabs = {
        messages: false,
        flow: false,
        qos: true,
        logs: false,
        export: false
    };
    isBrowserWindow: false;
    _isLoaded = false;
    get isLoaded(): boolean {
        return this._isLoaded;
    }
    @Input('isLoaded') set isLoaded(val) {
        this._isLoaded = val;
        if (this.sipDataItem) {
            this.dataLogs = this.sipDataItem.data.messages.filter(i => !i.method).map(i => ({ payload: i }));
            this.checkStatusTabs();
        }
    }

    _isData = false;
    get isData() {
        return this._isData;
    }
    @Input('isData') set isData(val) {
        this._isData = val;
        if (this.sipDataItem) {
            this.dataLogs = this.sipDataItem.data.messages.filter(i => !i.method).map(i => ({ payload: i }));
            this.checkStatusTabs();
        }
    }

    @Output() openMessage: EventEmitter<any> = new EventEmitter();
    @Output() close: EventEmitter<any> = new EventEmitter();

    dataLogs: Array<any>;

    constructor() { }

    ngOnInit() {
        if (this.sipDataItem) {
            this.dataLogs = this.sipDataItem.data.messages.filter(i => !i.method).map(i => ({ payload: i }));
            this.checkStatusTabs();
        }
    }
    checkStatusTabs() {
        const params: any = Functions.getUriParams();
        const paramTabs = {
            messages: true,
            flow: true,
            qos: true,
            logs: true,
            export: true
        };
        if (params.tabs) {
            const pTabs = params.tabs.split(',');
            Object.keys(this.tabs).forEach( i => {
                paramTabs[i] = pTabs.indexOf(i) !== -1;
            });
            console.log({paramTabs});
        }
        this.tabs.logs = this.dataLogs.length > 0 && paramTabs.logs;
        this.tabs.messages = this.sipDataItem.data.messages.length > 0 && paramTabs.messages;
        this.tabs.flow = this.sipDataItem.data.messages.length > 0 && paramTabs.flow;
        this.tabs.export = this.sipDataItem.data &&
            this.sipDataItem.data.messages &&
            this.sipDataItem.data.messages[0] &&
            !!this.sipDataItem.data.messages[0].id && paramTabs.export;
    }
    onTabQos(isVisible: boolean) {
        const params: any = Functions.getUriParams();
        this.tabs.qos = params.tabs ?
            isVisible && params.tabs.split(',').indexOf('qos') !== -1 :
            isVisible;
    }
    onClose() {
        this.close.emit();
    }

    addWindow(data: any) {
        if (data.method === 'LOG') {
            this.openMessage.emit({
                data,
                isLog: true,
                isBrowserWindow: this.isBrowserWindow
            });
        } else {
            data.item.mouseEventData = data.mouseEventData;
            this.openMessage.emit({
                data: data.item,
                isBrowserWindow: this.isBrowserWindow
            });
        }
    }

    onBrowserWindow (event) {
        this.isBrowserWindow = event;
    }
}
