import { FormRequest, IFormResponse, IForm, IFormData, IRow, IValue } from 'e1-service';

export const UDC = 'fs_P0004A_W0004AA';

export interface IUDCRow extends IRow {
    sCodes_10: IValue;
    sDescription01_11: IValue;
    sSpecialHandling_13: IValue;
    chHardCoded_14: IValue;
}

export interface IUDCFormData extends IFormData<IUDCRow> {
    txtUserDefinedCodes_18: IValue;
    txtProductCode_16: IValue;
}

export type IUDCForm = IForm<IUDCFormData>;

export interface IUDCResponse extends IFormResponse {
    fs_P0004A_W0004AA: IUDCForm;
}

export class UDCRequest extends FormRequest {
    constructor(sy: string, rt: string) {
        super();
        this.formName = 'P0004A_W0004AA';
        this.formServiceAction = 'R';
        this.findOnEntry = 'TRUE';
        this.formInputs = [
            {
                id: '1',
                value: sy
            },
            {
                id: '2',
                value: rt
            }
        ];
    }
}
