import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { E1Actions } from 'e1-service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/interval';
import * as Moment from 'moment';

import { IState } from '../store/state';
import { AppActions } from '../store/actions';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {
  clock: Observable<Date>;
  status: Observable<string>;
  timeStamp: Observable<Date>;
  username: Observable<string>;
  environment: Observable<string>;
  signout() {
    this.store.dispatch(new AppActions.ResetAction());
    this.store.dispatch(new E1Actions.ResetAction('sign-out'));
  }
  refresh() {
    this.store.dispatch(new AppActions.RefreshAction());
  }
  ngOnInit() {
  }
  constructor(
    public store: Store<IState>
  ) {
    this.status = store.select(s => s.e1.status);
    this.username = store.select(s => s.e1.authResponse ? s.e1.authResponse.userInfo.alphaName : null);
    this.environment = store.select(s => s.e1.authResponse ? s.e1.authResponse.environment : null);
    this.timeStamp = store.select<Date>(s => s.e1.databrowserResponse
      ? Moment(s.e1.databrowserResponse.timeStamp, 'YYYY-MM-DD:hh.mm.ss').toDate() : null);
    this.clock = Observable.interval(60000).startWith(0).map(tick => new Date());
  }
}
