import { FormRequest, IFormResponse, IForm, IFormData, IRow, IValue } from 'e1-service';

export const W01311E = 'fs_P01311_W01311E';
export const S01311A = 's_W01311E_S01311A_17';

export interface ICalendarSubformRow extends IRow {
    sSubject_51: IValue;
    sActivityID_26: IValue;
    mnActivityInstance_88: IValue;
    chCompletedActivity_24: IValue;
    chPrivateActivity_27: IValue;
    sActivityType_29: IValue;
    chAllDayIndicator_30: IValue;
    sCalendarType_32: IValue;
    mnCommitmentLevel_33: IValue;
    chDisplayActivityOnCalendar_34: IValue;
    sIdentifier_36: IValue;
    sIdentifierIDType_37: IValue;
    sLocation_41: IValue;
    sRecurrenceID_48: IValue;
    utTimeDateEnd_53: IValue;
    utTimeDateStart_55: IValue;
    mnIdentiferAN8_89: IValue;
    sInstanceIdentifier_90: IValue;
    chIsToDo_91: IValue;
    sCategoryCode1_92: IValue;
    sCategoryCode2_93: IValue;
    sCategoryCode3_94: IValue;
    sCategoryCode4_95: IValue;
    sCategoryCode5_96: IValue;
}

export interface ICalendarSubformFormData extends IFormData<ICalendarSubformRow> {
    txtIdentifierID_86: IValue;
    txtIdentifierIDType_58: IValue;
    txtCalendarType_82: IValue;
}

export interface ICalendarMaintenanceSubforms {
    s_W01311E_S01311A_17: IForm<ICalendarSubformFormData>;
}

export interface ICalendarMaintenanceForm extends IForm<IFormData<IRow>> {
    subforms: ICalendarMaintenanceSubforms;
}

export interface ICalendarMaintenanceResponse extends IFormResponse {
    fs_P01311_W01311E: ICalendarMaintenanceForm;
}

export class CalendarMaintenanceRequest extends FormRequest {
    constructor(id: string, idType: string, calType: string) {
        super();
        this.formName = 'P01311_W01311E';
        this.formServiceAction = 'R';
        this.formInputs = [
            {
                id: '2',
                value: id
            },
            {
                id: '3',
                value: idType
            },
            {
                id: '5',
                value: calType
            }
        ];
    }
}
