import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { E1Actions, E1ActionTypes, FormService, DatabrowserService, BatchformService, BatchformRequest } from 'e1-service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import * as Moment from 'moment';

import '../helpers/utils';
import { Global } from '../global';
import { IState, IUDC, IMCU, ISchedule, IRoster, IEmployee } from '../store/state';
import { E1HelperService } from './e1-helper';
import { AppActions, ActionTypes } from '../store/actions';
import { UDCRequest, UDC, IUDCResponse } from './udc';
import { V01311ARequest, IV01311AResponse, IV01311ARow, V01311A } from './v01311a';
import { F0101Request, IF0101Response, F0101 } from './f0101';
import { F0006Request, IF0006Response, F0006 } from './f0006';
import { F060116Request, IF060116Response, F060116 } from './f060116';
import { WWEmployeesRequest, IWWEmployeesResponse, W060116F } from './ww-employees';
import { EmployeeScheduleRequest, IEmployeeScheduleForm, W597311A } from './employee-schedule';

/**
 * E1 Effects Service
 */

function jdeUTCFormat(): string {
    const s = '{0}' + Global.jdeDateSeparator + '{1}' + Global.jdeDateSeparator + '{2} HH:mm:ss';
    switch (Global.jdeDateFormat) {
        case 'DME':
        case 'DMY':
            return s.format('DD', 'MM', 'YYYY');
        case 'EMD':
        case 'YMD':
            return s.format('YYYY', 'MM', 'DD');
        case 'MDE':
        case 'MDY':
            return s.format('MM', 'DD', 'YYYY');
    }
    return s.format('DD', 'MM', 'YYYY');
}

@Injectable()
export class E1EffectsService {
    @Effect()
    authResponse$ = this.actions$.ofType<E1Actions.AuthResponseAction>(E1ActionTypes.AUTH_RESPONSE)
        .map(action => action.payload.authResponse)
        .switchMap(authResponse => {
            Global.jdeDateFormat = authResponse.userInfo.dateFormat;
            Global.jdeDateSeparator = authResponse.userInfo.dateSeperator;
            return Observable.of(new AppActions.RefreshAction());
        });
    @Effect({ dispatch: false })
    refresh$ = this.actions$.ofType<AppActions.RefreshAction>(ActionTypes.REFRESH)
        .do(() => {
            this.form.request = new UDCRequest('01', 'AD');
            this.e1.call(this.form);
            this.db.request = new V01311ARequest();
            this.e1.call(this.db);
        });
    @Effect()
    udcResponse$ = this.actions$.ofType<E1Actions.FormResponseAction>(E1ActionTypes.FORM_RESPONSE)
        .map(action => action.payload.formResponse)
        .filter(form => form[UDC])
        .switchMap((form: IUDCResponse) => {
            return Observable.of(new AppActions.UDCsAction(
                form.fs_P0004A_W0004AA.data.txtProductCode_16.value,
                form.fs_P0004A_W0004AA.data.txtUserDefinedCodes_18.value,
                form.fs_P0004A_W0004AA.data.gridData.rowset
                    .map<IUDC>(r => {
                        return {
                            sy: form.fs_P0004A_W0004AA.data.txtProductCode_16.value,
                            rt: form.fs_P0004A_W0004AA.data.txtUserDefinedCodes_18.value,
                            code: r.sCodes_10.value,
                            title: r.sDescription01_11.value
                        };
                    })
            ));
        });
    @Effect()
    v01311aResponse$ = this.actions$.ofType<E1Actions.DatabrowserResponseAction>(E1ActionTypes.DATABROWSER_RESPONSE)
        .map(action => action.payload.databrowserResponse)
        .filter(db => db[V01311A])
        .switchMap((v01311a: IV01311AResponse) => {
            const an8s = v01311a.fs_DATABROWSE_V01311A.data.gridData.rowset
                .map(r => r.F01301D_IDAN8.value)
                .filter((r, pos, ar) => ar.indexOf(r) === pos);
            this.db.request = new F0101Request(an8s);
            this.e1.call(this.db);
            return Observable.of(new AppActions.ScheduledRostersAction(
                v01311a.fs_DATABROWSE_V01311A.data.gridData.rowset
                    .map<IRoster>(r => {
                        return {
                            an8: r.F01301D_IDAN8.value,
                            type: r.F01311_CALTY.value,
                            activity: r.F01301D_ACTVTYP.value,
                            title: r.F01311_CALNM.value,
                            cd1: r.F01301D_ATVCD1.value,
                            start: Moment(r.F01301D_TDSTR.value, jdeUTCFormat()),
                            end: Moment(r.F01301D_TDEND.value, jdeUTCFormat())
                        };
                    })
            ));
        });
    @Effect()
    v0101Response$ = this.actions$.ofType<E1Actions.DatabrowserResponseAction>(E1ActionTypes.DATABROWSER_RESPONSE)
        .map(action => action.payload.databrowserResponse)
        .filter(db => db[F0101])
        .switchMap((f0101: IF0101Response) => {
            const mcus = f0101.fs_DATABROWSE_F0101.data.gridData.rowset
                .map(r => r.F0101_MCU.value)
                .filter((r, pos, ar) => ar.indexOf(r) === pos);
            this.db.request = new F0006Request(mcus);
            this.e1.call(this.db);
            //this.db.request = new F060116Request(mcus);
            //this.e1.call(this.db);
            this.form.request = new WWEmployeesRequest(mcus);
            this.e1.call(this.form);
            return Observable.of(new AppActions.SchedulesAction(f0101.fs_DATABROWSE_F0101.data.gridData.rowset
                .map<ISchedule>(r => {
                    return {
                        mcu: r.F0101_MCU.value.trim(),
                        an8: r.F0101_AN8.value,
                        ac23: r.F0101_AC23.value,
                        alph: r.F0101_ALPH.value
                    };
                })));
        });
    @Effect()
    f0006Response$ = this.actions$.ofType<E1Actions.DatabrowserResponseAction>(E1ActionTypes.DATABROWSER_RESPONSE)
        .map(actions => actions.payload.databrowserResponse)
        .filter(db => db[F0006])
        .switchMap((f0006: IF0006Response) => {
            return Observable.of(new AppActions.MCUsAction(f0006.fs_DATABROWSE_F0006.data.gridData.rowset
                .map<IMCU>(r => {
                    return {
                        mcu: r.F0006_MCU.value.trim(),
                        co: r.F0006_CO.value,
                        title: r.F0006_DL01.value
                    };
                })
            ));
        });
    @Effect()
    wwEmployeesResponse$ = this.actions$.ofType<E1Actions.FormResponseAction>(E1ActionTypes.FORM_RESPONSE)
        .map(actions => actions.payload.formResponse)
        .filter(form => form[W060116F])
        .switchMap((form: IWWEmployeesResponse) => {
            const start = new Date();
            start.setDate(1);
            const end = start.addMonths(3);
            const request = new BatchformRequest();
            request.formRequests = form.fs_P060116_W060116F.data.gridData.rowset
                .map(r => {
                    return new EmployeeScheduleRequest(r.mnAddressNumber_29.value, start, end);
                });
            this.batch.request = request;
            this.e1.call(this.batch);
            return Observable.of(new AppActions.EmployeesAction(
                form.fs_P060116_W060116F.data.gridData.rowset
                    .map<IEmployee>(r => {
                        return {
                            hmco: r.sCo_35.value,
                            hmcu: r.sHomeBusinessUnit_36.value.trim(),
                            shft: r.chSh_47.value,
                            shftT: r.sShiftcode_89.value,
                            jbcd: r.sJobTyp_42.value,
                            jbst: r.sJobStep_43.value,
                            job: r.sEEOJob_88.value,
                            an8: r.mnAddressNumber_29.value,
                            alph: r.sAlphaName_30.value
                        };
                    })
            ));
        })
    @Effect()
    employeeSchedule$ = this.actions$.ofType<E1Actions.BatchformResponseAction>(E1ActionTypes.BATCHFORM_RESPONSE)
        .map(action => action.payload.batchformResponse)
        .switchMap(bf => {
            const roster: IRoster[] = [];
            for (let i = 0; bf[W597311A.format(i)]; i++) {
                const form: IEmployeeScheduleForm = bf[W597311A.format(i)];
                roster.push(...form.data.gridData.rowset
                    .map<IRoster>(r => {
                        return {
                            an8: r.mnAddressNumber_21.value,
                            type: r.sCalendarType_24.value,
                            activity: r.sActivityType_20.value,
                            title: r.sSubject_17.value,
                            cd1: r.sCategoryCode1_36.value,
                            start: Moment(r.utTimeDateStart_18.value, jdeUTCFormat()),
                            end: Moment(r.utTimeDateEnd_19.value, jdeUTCFormat())
                        };
                    }));
            }
            return Observable.of(new AppActions.EmployeeRostersAction(roster));
        });
    constructor(
        public actions$: Actions,
        public store: Store<IState>,
        public form: FormService,
        public db: DatabrowserService,
        public batch: BatchformService,
        public e1: E1HelperService
    ) { }
}
