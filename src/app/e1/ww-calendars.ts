import { FormRequest, IFormResponse, IForm, IFormData, IRow, IValue } from 'e1-service';

export const W01311A = 'fs_P01311_W01311A';

export interface IWWCalendarsRow extends IRow {
    sCalendarName_26: IValue;
    sCalendarType_29: IValue;
    sIdentifierType_28: IValue;
    sIdentifier_27: IValue;
    sDefaultViewMode_85: IValue;
}

export type IWWCalendarsFormData = IFormData<IWWCalendarsRow>;

export type IWWCalendarsForm = IForm<IWWCalendarsFormData>;

export interface IWWCalendarsResponse extends IFormResponse {
    fs_P01311_W01311A: IWWCalendarsForm;
}

export class WWCalendarsRequest extends FormRequest {
    constructor() {
        super();
        this.formName = 'P01311_W01311A';
        this.formServiceAction = 'R';
        this.formActions = [
            {
                controlID: '82',
                command: 'SetComboValue',
                value: '11'
            },
            {
                controlID: '52',
                command: 'DoAction'
            }
        ];
    }
}
