import { DatabrowserRequest, IFormResponse, IForm, IFormData, IRow, IValue } from 'e1-service';
import { Global } from '../global';

import '../helpers/utils';

export const V01311A = 'fs_DATABROWSE_V01311A';

export interface IV01311ARow extends IRow {
    F01311_INDID: IValue;
    F01311_INDIDTY: IValue;
    F01311_CALTY: IValue;
    F01311_CALNM: IValue;
    F01311_WDS: IValue;
    F01311_WDE: IValue;
    F01311_CLNCD1: IValue;
    F01311_CLNCD2: IValue;
    F01311_CLNCD3: IValue;
    F01311_CLNCD4: IValue;
    F01311_CLNCD5: IValue;
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

export type IV01311AFormData = IFormData<IV01311ARow>;

export type IV01311AForm = IForm<IV01311AFormData>;

export interface IV01311AResponse extends IFormResponse {
    fs_DATABROWSE_V01311A: IV01311AForm;
}

export class V01311ARequest extends DatabrowserRequest {
    readonly ids = `
F01311.INDID|F01311.INDIDTY|F01311.CALTY|F01311.CALNM|F01311.WDS|F01311_WDE|
F01311.CLNCD1|F01311.CLNCD2|F01311.CLNCD3|F01311.CLNCD4|F01311.CLNCD5|
F01301D.ACTVTYP|F01301D.SUBJECT|F01301D.TDSTR|F01301D.TDEND|F01301D.ADI|F01301D.DOCAL|
F01301D.IDAN8|F01301D.ATVCD1|F01301D.ATVCD2|F01301D.ATVCD3|F01301D.ATVCD4|F01301D.ATVCD5|`;
    constructor() {
        super();
        const start = new Date();
        start.setDate(1);
        const end = start.addDays(90);
        this.findOnEntry = 'TRUE';
        this.targetName = 'V01311A';
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
                },
                {
                    value: [
                        {
                            content: 'WRKSCH',
                            specialValueId: 'LITERAL'
                        }
                    ],
                    controlId: 'F01311.CALTY',
                    operator: 'EQUAL'
                }
            ],
            autoFind: true,
            matchType: 'MATCH_ALL',
            autoClear: false
        };
    }
}
