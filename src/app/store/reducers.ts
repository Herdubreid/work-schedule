import { e1Reducer } from 'e1-service';
import * as Moment from 'moment';

import { IAppState, initialAppState } from './state';
import { AppActions, ActionTypes } from './actions';
/**
 * Application Reducers
 */

export function appReducer(state = initialAppState, action: AppActions.AllActions): IAppState {
    switch (action.type) {
        case ActionTypes.UDCS:
            const udcs = state.udcs.filter(r => action.sy !== r.sy && action.rt !== r.rt);
            return Object.assign({}, state, {
                udcs: [...udcs, ...action.udcs]
            });
        case ActionTypes.MCUS:
            return Object.assign({}, state, {
                mcus: [...action.mcus]
            });
        case ActionTypes.SCHEDULES:
            return Object.assign({}, state, {
                schedules: [...action.schedules]
            });
        case ActionTypes.SCHEDULED_ROSTERS:
            return Object.assign({}, state, {
                rosters: [...action.rosters]
            });
        case ActionTypes.EMPLOYEES:
            return Object.assign({}, state, {
                employees: [...action.employees]
            });
        case ActionTypes.EMPLOYEE_ROSTERS:
            return Object.assign({}, state, {
                start: Moment(),
                end: Moment(),
                rosters: [...state.rosters, ...action.rosters]
            });
        case ActionTypes.SELECT_ROSTER:
            return Object.assign({}, state, {
                calendarTitle: action.title,
                select: action.select
            });
        case ActionTypes.SEARCH:
            return Object.assign({}, state, {
                search: action.search
            });
        case ActionTypes.START_END:
            return Object.assign({}, state, {
                start: action.start,
                end: action.end
            });
        case ActionTypes.RESET:
            return initialAppState;
        default:
            return state;
    }
}

export const reducer = { app: appReducer, e1: e1Reducer };
