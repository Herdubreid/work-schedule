import { DatabrowserRequest, IFormResponse, IForm, IFormData, IRow, IValue } from 'e1-service';

export const F060116 = 'fs_DATABROWSE_F060116';

export interface IF060116Row extends IRow {
    F060116_ALPH: IValue;
    F060116_AN8: IValue;
    F060116_ANPA: IValue;
    F060116_DST: IValue;
    F060116_DT: IValue;
    F060116_HMCO: IValue;
    F060116_HMCU: IValue;
    F060116_HMLC: IValue;
    F060116_JBCD: IValue;
    F060116_JBST: IValue;
    F060116_P013: IValue;
}

export type IF060116FormData = IFormData<IF060116Row>;

export type IF060116Form = IForm<IF060116FormData>;

export interface IF060116Response extends IFormResponse {
    fs_DATABROWSE_F060116: IF060116Form;
}

export class F060116Request extends DatabrowserRequest {
    constructor(hmcus: string[]) {
        super();
        this.findOnEntry = 'TRUE';
        this.targetName = 'F060116';
        this.targetType = 'table';
        this.dataServiceType = 'browse';
        this.returnControlIDs = 'ALPH|AN8|ANPA|DST|DT|HMCO|HMCU|HMLC|JBCD|JBST|P013';
        this.query = {
            condition: [
                {
                    value: hmcus.map(content => {
                        return {
                            content,
                            specialValueId: 'LITERAL'
                        };
                    }),
                    controlId: 'F060116.HMCU',
                    operator: 'LIST'
                },
                {
                    value: [
                        {
                            content: '01/01/1970',
                            specialValueId: 'LITERAL'
                        }
                    ],
                    controlId: 'F0601161.DT',
                    operator: 'LESS'
                }
            ],
            autoFind: true,
            matchType: 'MATCH_ALL',
            autoClear: false
        };
    }
}
