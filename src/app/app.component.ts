import { Component, OnInit  } from '@angular/core';
import { CallTransactionService, SearchCallService} from './services';
import { Functions } from './helpers/functions';

import * as moment from 'moment';
import { CallReportService } from './services/call/report.service';

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
        private searchCallService: SearchCallService,
        private callTransactionService: CallTransactionService,
        private callReportService: CallReportService
    ) {
        this.getParams = Functions.getUriParams();
        console.log({getParams: this.getParams});
        this.paramData = {
            id: this.getParams.callid || '',
            mouseEventData: 'item.mouseEventData',
            dataQOS: [],
            data: this.testdata,
            loaded: false
        };
    }
    ngOnInit() {
        // this.testdata = await this.getDataTransaction();
        // const windowData = this.paramData;
        // this.paramData = {
        //     id: this.getParams.callid || '',
        //     mouseEventData: 'item.mouseEventData',
        //     data: this.testdata,
        //     loaded: true
        // };


        this.loading = false;
        const readyToOpen = (data: any, dataQOS: any) => {
            if (!data || !dataQOS) {
                return;
            }
            this.testdata = data;

            this.paramData.loaded = true;
            this.paramData.data = data;
            this.paramData.dataQOS = dataQOS;
            this.paramData.snapShotTimeRange = {
                from: this.getParams.from,
                to: this.getParams.to
            };
        };
        let localDataQOS: any = null;
        let localData: any = null;

        this.callReportService.postQOS(this.getQuery(true)).toPromise().then(dataQOS => {
            localDataQOS = dataQOS;
            readyToOpen(localData, localDataQOS);
        });

        this.callTransactionService.getTransaction(this.getQuery()).toPromise().then(data => {
            localData = data;
            readyToOpen(localData, localDataQOS);
        });
    }
    // async getDataTransaction() {
    //     const transactionData = await this.callTransactionService.getTransaction(this.getQuery()).toPromise();
    //     console.log({transactionData});
    //     return transactionData;
    // }
    getQuery(isQOS = false) {
        const localData = {
            protocol_id: this.getParams.protocol_id || '1_call'
        };
        const callid = this.getParams.callid || '';
        let callids = [];
        if (callid.split(',').length > 0) {
            callids = callid.split(',');
        } else {
            callids = [callid];
        }
        const search = {};
        search[localData.protocol_id] = {
            id: this.getParams.id * 1,
            callid: callids,
            uuid: []
        };
        const query: any = {
            param: {
                transaction: {
                    call: localData.protocol_id === '1_call',
                    registration: localData.protocol_id === '1_registration',
                    rest: localData.protocol_id === '1_default'
                },
                search,
                location: {},
                timezone: {
                    value: -180,
                    name: 'Local'
                }
            },
            timestamp: {
                from: this.getParams.from * 1 || 1574632800000,
                to: this.getParams.to * 1 || 1577224799000
            }
        };
        if (isQOS) {
            query.param.id = {};
        } else {
            query.param.limit = this.getParams.limit || 200;
        }
        return query;
    }

    addWindowMessage(row, mouseEventData = null) {
        const localData = {
            protocol_id: row.data.profile || '1_call'
        };
        const color = Functions.getColorByString(row.data.method || 'LOG');
        const mData = {
            loaded: false,
            data: null,
            id: row.data.id * 1,
            headerColor: color || '',
            mouseEventData: mouseEventData || row.data.mouseEventData,
            isBrowserWindow: row.isBrowserWindow
        };
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
                from: this.getParams.from * 1 || 1574632800000,
                to: this.getParams.to * 1 || 1577224799000
            }
        };

        request.param.limit = 1;
        request.param.search[localData.protocol_id] = { id: row.data.id * 1 };
        request.param.transaction = {
            call: localData.protocol_id.match('call'),
            registration: localData.protocol_id.match('registration'),
            rest: localData.protocol_id.match('default')
        };
        // this.arrMessageDetail.push(mData);
        this.isMessage = mData.loaded;
        this.messageData = mData.data;
        const getMessageSubscription = this.searchCallService.getMessage(request).subscribe(data => {
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
