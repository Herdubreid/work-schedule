import { IServerState, initialServerState } from 'e1-service';
import * as Moment from 'moment';

/**
 * Application State
 */

export interface IRoster {
    an8: string;
    type: string;
    activity: string;
    title: string;
    cd1: string;
    start: Moment.Moment;
    end: Moment.Moment;
}
export interface IEmployee {
    hmco: string;
    hmcu: string;
    shft: string;
    shftT: string;
    jbcd: string;
    jbst: string;
    job: string;
    an8: string;
    alph: string;
}
export interface ISchedule {
    mcu: string;
    an8: string;
    ac23: string;
    alph: string;
}
export interface IUDC {
    sy: string;
    rt: string;
    code: string;
    title: string;
}
export interface IMCU {
    mcu: string;
    co: string;
    title: string;
}
export interface IAppState {
    mode: string;
    status: string;
    udcs: IUDC[];
    mcus: IMCU[];
    schedules: ISchedule[];
    rosters: IRoster[];
    calendarTitle: string;
    start: Moment.Moment;
    end: Moment.Moment;
    employees: IEmployee[];
    select: string[];
    search: string;
}
export interface IState {
    app: IAppState;
    e1: IServerState;
}
export const initialAppState = {
    mode: 'NORMAL',
    status: 'OFF',
    udcs: [],
    mcus: [],
    schedules: [],
    rosters: [],
    calendarTitle: 'Calendar',
    start: null,
    end: null,
    employees: [],
    select: [],
    search: ''
};
export const initialState = {
    app: initialAppState,
    e1: initialServerState
};
