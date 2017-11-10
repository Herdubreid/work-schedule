import { DatabrowserRequest, IFormResponse, IForm, IFormData, IRow, IValue } from 'e1-service';

export const F0101 = 'fs_DATABROWSE_F0101';

export interface IF0101Row extends IRow {
    F0101_ALPH: IValue;
    F0101_AN8: IValue;
    F0101_MCU: IValue;
    F0101_AC23: IValue;
}

export type IF0101FormData = IFormData<IF0101Row>;

export type IF0101Form = IForm<IF0101FormData>;

export interface IF0101Response extends IFormResponse {
    fs_DATABROWSE_F0101: IF0101Form;
}

export class F0101Request extends DatabrowserRequest {
    constructor(an8s: string[]) {
        super();
        this.findOnEntry = 'TRUE';
        this.targetName = 'F0101';
        this.targetType = 'table';
        this.dataServiceType = 'browse';
        this.returnControlIDs = 'ALPH|AN8|MCU|AC23';
        this.query = {
            condition: [
                {
                    value: an8s.map(content => {
                        return {
                            content,
                            specialValueId: 'LITERAL'
                        };
                    }),
                    controlId: 'F0101.AN8',
                    operator: 'LIST'
                }
            ],
            autoFind: true,
            matchType: 'MATCH_ALL',
            autoClear: false
        };
    }
}
