import { Component, OnInit  } from '@angular/core';
import { AuthenticationService, CallTransactionService, SearchCallService} from './services';
import { Functions } from './helpers/functions';
import { first } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'homer-view';
    loading = false;
    getParams: any;
    testdata: any;

    paramData: any;
    isMessage = false;
    messageData = null;
    constructor(
        private _scs: SearchCallService,
        private authenticationService: AuthenticationService,
        private callTransactionService: CallTransactionService
    ) {
        this.getParams = Functions.getUriParams();

        this.paramData = {
            id: this.getParams.callid || '',
            mouseEventData: 'item.mouseEventData',
            data: this.testdata,
            loaded: false
        };
    }
    ngOnInit() {
        this.authenticationService.currentUser.subscribe(async (user) => {
            if (!user) {
                /* FOR TEST API  --> Here add your API user and password .logn('user', 'password') */
                await this.authenticationService.login('admin', 'admin').pipe(first()).toPromise();
                return;
            }
         this.testdata = await this.getDataTransaction();
            this.paramData = {
                id: this.getParams.callid || '',
                mouseEventData: 'item.mouseEventData',
                data: this.testdata,
                loaded: true
            };

            console.log('this.getParams', this.getParams);

            this.loading = true;
           
        });
    }
    async getDataTransaction() {
        const transactionData = await this.callTransactionService.getTransaction(this.getQuery()).toPromise();
        console.log({transactionData});
        return transactionData;
    }
    getQuery() {
        const localData = {
            protocol_id: this.getParams.protocol_id || '1_call'
        };
        let callids = [];
        if (this.getParams.callid.split(',').length > 0) {
            callids = this.getParams.callid.split(',');
        } else {
            callids = [this.getParams.callid];
        }
        const search = {};
        search[localData.protocol_id] = {
            id: this.getParams.id*1,
            callid: callids,
            uuid: []
        };
        return {
            param: {
                transaction: {
                    call: localData.protocol_id === '1_call',
                    registration: localData.protocol_id === '1_registration',
                    rest: localData.protocol_id === '1_default'
                },
                limit: this.getParams.limit *1 || 200,
                search,
                location: {},
                timezone: {
                    value: -180,
                    name: 'Local'
                }
            },
            timestamp: {
                from: this.getParams.from *1 || 1574632800000,
                to: this.getParams.to *1 || 1577224799000
            }
        };
    }
    addWindowMessage(row, mouseEventData = null) {
        const localData = {
            protocol_id: this.getParams.protocol_id || '1_call'
        };
        const color = Functions.getColorByString(row.data.method || 'LOG');
        const mData = {
            loaded: false,
            data: null,
            id: row.data.id,
            headerColor: color || '',
            mouseEventData: mouseEventData || row.data.mouseEventData,
            isBrowserWindow: row.isBrowserWindow
        };
        console.log('', row)
        if (row.isLog) {
            const data = row.data.item;
            mData.data = data;
            mData.data.item = {
                raw: mData.data.raw
            };
            mData.data.messageDetaiTableData = Object.keys(mData.data)
                .map(i => {
                    let val;
                    if (i === 'create_date') {
                        val = moment(mData.data[i]).format('DD-MM-YYYY');
                    } else if (i === 'timeSeconds') {
                        val = moment( mData.data[i]).format('hh:mm:ss.SSS');
                    } else {
                        val = mData.data[i];
                    }
                    return {name: i, value: val};
                })
                .filter(i => typeof i.value !== 'object' && i.name !== 'raw');
            // this.changeDetectorRefs.detectChanges();
            mData.loaded = true;
            this.isMessage = mData.loaded;
            this.messageData = mData.data;
            // this.arrMessageDetail.push(mData);

            console.log('', mData, row)
            return;
        }

        const request = {
            param: {
                transaction: {},
                limit: 200,
                search: {},
                location: {},
                timezone: {
                    value: -180,
                    name: 'Local'
                }
            },
            timestamp: {
                from: this.getParams.from *1 || 1574632800000,
                to: this.getParams.to *1 || 1577224799000
            }
        };

        request.param.limit = 1;
        request.param.search[localData.protocol_id] = { id: row.data.id *1};
        request.param.transaction = {
            call: localData.protocol_id === '1_call',
            registration: localData.protocol_id === '1_registration',
            rest: localData.protocol_id === '1_default'
        };

        // this.arrMessageDetail.push(mData);
        this.isMessage = mData.loaded;
        this.messageData = mData.data;
        const getMessageSubscription = this._scs.getMessage(request).subscribe(data => {
            getMessageSubscription.unsubscribe();

            mData.data = data.data[0];
            mData.data.item = {
                raw: mData.data.raw
            };
            mData.data.messageDetaiTableData = Object.keys(mData.data)
                .map(i => {
                    let val;
                    if (i === 'create_date') {
                        val = moment(mData.data[i]).format('DD-MM-YYYY');
                    } else if (i === 'timeSeconds') {
                        val = moment( mData.data[i]).format('hh:mm:ss.SSS');
                    } else {
                        val = mData.data[i];
                    }
                    return {name: i, value: val};
                })
                .filter(i => typeof i.value !== 'object' && i.name !== 'raw');
            // this.changeDetectorRefs.detectChanges();
            mData.loaded = true;
            this.isMessage = mData.loaded;
            this.messageData = mData.data;
        });
    }
}
