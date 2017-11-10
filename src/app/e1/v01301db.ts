import { DatabrowserRequest, IFormResponse, IForm, IFormData, IRow, IValue } from 'e1-service';
import { Global } from '../global';

import '../helpers/utils';

export const V01301DB = 'fs_DATABROWSE_V01301DB';

export interface IV01301DBRow extends IRow {
    F01301D_INDIDTY: IValue;
    F01301D_INDID: IValue;
    F01301D_CALTY: IValue;
    F01301D_ACTVTYP: IValue;
    F01301D_SUBJECT: IValue;
    F01301D_TDSTR: IValue;
    F01301D_TDEND: IValue;
    F01301D_ADI: IValue;
    F01301D_DOCAL: IValue;
    F01301D_IDAN8: IValue;
    F01301D_ATVCD1: IValue;
    F01301D_ATVCD2: IValue;
    F01301D_ATVCD3: IValue;
    F01301D_ATVCD4: IValue;
    F01301D_ATVCD5: IValue;
}

export type IV01301DBFormData = IFormData<IV01301DBRow>;

export type IV01301DBForm = IForm<IV01301DBFormData>;

export interface IV01301DBResponse extends IFormResponse {
    fs_DATABROWSE_V01301DB: IV01301DBForm;
}

export class V01301DBRequest extends DatabrowserRequest {
    readonly ids = `
F01301D.INDIDTY|F01301D.INDID|F01301D.CALTY|F01301D.ACTVTYP|F01301D.SUBJECT|F01301D.TDSTR|
F01301D.TDEND|F01301D.ADI|F01301D.DOCAL|F01301D.IDAN8|F01301D.ATVCD1|F01301D.ATVCD2|
F01301D.ATVCD3|F01301D.ATVCD4|F01301D.ATVCD5`;
    constructor() {
        super();
        const start = new Date(Date.now());
        const end = start.addDays(90);
        this.findOnEntry = 'TRUE';
        this.targetName = 'V01301DB';
        this.targetType = 'view';
        this.dataServiceType = 'browse';
        this.maxPageSize = '5000';
        this.returnControlIDs = this.ids;
        this.query = {
            condition: [
                {
                    value: [
                        {
                            content: start.jdeFormat(Global.jdeDateFormat, Global.jdeDateSeparator),
                            specialValueId: 'LITERAL'
                        }
                    ],
                    controlId: 'F01301D.TDSTR',
                    operator: 'GREATER_EQUAL'
                },
                {
                    value: [
                        {
                            content: end.jdeFormat(Global.jdeDateFormat, Global.jdeDateSeparator),
                            specialValueId: 'LITERAL'
                        }
                    ],
                    controlId: 'F01301D.TDEND',
                    operator: 'LESS_EQUAL'
                }
            ],
            autoFind: true,
            matchType: 'MATCH_ALL',
            autoClear: false
        };
    }
}
