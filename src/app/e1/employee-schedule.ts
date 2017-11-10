import { FormRequest, IFormResponse, IForm, IFormData, IRow, IValue } from 'e1-service';
import { INumber } from './number';
import { Global } from '../global';

export const W597311A = 'fs_{0}_P597311_W597311A';

export interface IEmployeeScheduleRow extends IRow {
    sActivityID_15: IValue;
    sInstanceIdentifier_16: IValue;
    sSubject_17: IValue;
    utTimeDateStart_18: IValue;
    utTimeDateEnd_19: IValue;
    sActivityType_20: IValue;
    mnAddressNumber_21: IValue;
    chAllDayIndicator_22: IValue;
    sCalendarType_24: IValue;
    sCategoryCode1_36: IValue;
    sCategoryCode2_37: IValue;
    sCategoryCode3_38: IValue;
    sCategoryCode4_39: IValue;
    sCategoryCode5_40: IValue;
}

export interface IEmployeeScheduleFormData extends IFormData<IEmployeeScheduleRow> {
    txtAddressNumber_28: IValue;
    lblDL01_30: IValue;
    txtjdFromDate_31: INumber;
    txtjdToDate_33: INumber;
}

export type IEmployeeScheduleForm = IForm<IEmployeeScheduleFormData>;

export interface IEmployeeScheduleResponse extends IFormResponse {
    fs_P597311_W597311A: IEmployeeScheduleForm;
}

export class EmployeeScheduleRequest extends FormRequest {
    constructor(an8: string, from: Date, to: Date) {
        super();
        this.formName = 'P597311_W597311A';
        this.formServiceAction = 'R';
        this.formInputs = [
            {
                id: '1',
                value: an8
            },
            {
                id: '2',
                value: from.jdeFormat(Global.jdeDateFormat, Global.jdeDateSeparator)
            },
            {
                id: '3',
                value: to.jdeFormat(Global.jdeDateFormat, Global.jdeDateSeparator)
            }
        ];
    }
}
