import { Component, OnInit, Input } from '@angular/core';
import { ExportCallService } from '../../../services/export/call.service';
import { DateTimeRangeService } from '../../../services/data-time-range.service';
import { Functions } from '../../../helpers/functions';
import { ConstValue } from '../../../models';



@Component({
  selector: 'app-tab-export',
  templateUrl: './tab-export.component.html',
  styleUrls: ['./tab-export.component.css']
})
export class TabExportComponent implements OnInit {
    @Input() callid;
    @Input() id;


    constructor(
        private _ecs: ExportCallService
    ) { }

    ngOnInit() {
    }

    queryBuilder() {
        const localData = {
            fields: [],
            protocol_id: '1_call'
        };

        const getParams: any = Functions.getUriParams();

        const search = {};
        search[localData.protocol_id] = {
            id: this.id,
            callid: [this.callid],
            uuid: []
        };
        return {
            timestamp: {
                from: getParams.from || 1574632800000,
                to: getParams.to || 1577224799000
            },
            param: {
                search,
                location: {},
                transaction: {
                    call: localData.protocol_id === '1_call',
                    registration: localData.protocol_id === '1_registration',
                    rest: localData.protocol_id === '1_default'
                },
                id: {},
                timezone: {
                    value: -180,
                    name: 'Local'
                }
            }
        };
    }
    exportPCAP() {
        const request = this.queryBuilder();
        const subscription = this._ecs.postMessagesPcap(request).subscribe((data: any) => {
            subscription.unsubscribe();
            Functions.saveToFile(data, `export_${this.id}.pcap`);
        });
    }

    exportTEXT () {
        const request = this.queryBuilder();
        const subscription = this._ecs.postMessagesText(request).subscribe((data: any) => {
            subscription.unsubscribe();
            Functions.saveToFile(data, `export_${this.id}.txt`, 'text/plain;charset=utf-8');
        });
    }
}
