import { Action } from '@ngrx/store';
import * as Moment from 'moment';

import { IAppState, IUDC, IMCU, ISchedule, IRoster, IEmployee } from './state';

/**
 * Application Actions
 */

export enum ActionTypes {
    LOAD_DEMO = 'LOAD_DEMO',
    UDCS = 'UDCS',
    MCUS = 'MCUS',
    SCHEDULES = 'SCHEDULES',
    EMPLOYEES = 'EMPLOYEES',
    SCHEDULED_ROSTERS = 'SCHEDULED_ROSTERS',
    EMPLOYEE_ROSTERS = 'ROSTERS',
    SELECT_ROSTER = 'SELECT_ROSTER',
    START_END = 'START_END',
    SEARCH = 'SEARCH',
    REFRESH = 'REFRESH',
    RESET = 'RESET'
}

export namespace AppActions {
    export class LoadDemoAction implements Action {
        readonly type = ActionTypes.LOAD_DEMO;
        constructor(public appState: IAppState) { }
    }
    export class UDCsAction implements Action {
        readonly type = ActionTypes.UDCS;
        constructor(public sy: string, public rt: string, public udcs: IUDC[]) { }
    }
    export class MCUsAction implements Action {
        readonly type = ActionTypes.MCUS;
        constructor(public mcus: IMCU[]) { }
    }
    export class SchedulesAction implements Action {
        readonly type = ActionTypes.SCHEDULES;
        constructor(public schedules: ISchedule[]) { }
    }
    export class ScheduledRostersAction implements Action {
        readonly type = ActionTypes.SCHEDULED_ROSTERS;
        constructor(public rosters: IRoster[]) { }
    }
    export class EmployeesAction implements Action {
        readonly type = ActionTypes.EMPLOYEES;
        constructor(public employees: IEmployee[]) { }
    }
    export class EmployeeRostersAction implements Action {
        readonly type = ActionTypes.EMPLOYEE_ROSTERS;
        constructor(public rosters: IRoster[]) { }
    }
    export class SelectRosterAction implements Action {
        readonly type = ActionTypes.SELECT_ROSTER;
        constructor(public title: string, public select: string[]) { }
    }
    export class StartEndAction implements Action {
        readonly type = ActionTypes.START_END;
        constructor(public start: Moment.Moment, public end: Moment.Moment) { }
    }
    export class SearchAction implements Action {
        readonly type = ActionTypes.SEARCH;
        constructor(public search: string) { }
    }
    export class RefreshAction implements Action {
        readonly type = ActionTypes.REFRESH;
    }
    export class ResetAction implements Action {
        readonly type = ActionTypes.RESET;
    }
    export type AllActions =
        LoadDemoAction |
        UDCsAction |
        MCUsAction |
        SchedulesAction |
        EmployeeRostersAction |
        ScheduledRostersAction |
        EmployeesAction |
        SelectRosterAction |
        SearchAction |
        StartEndAction |
        ResetAction |
        RefreshAction;
}
