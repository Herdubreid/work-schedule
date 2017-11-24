import { Component, OnInit, } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as Moment from 'moment';

import { IState, IRoster } from '../store/state';
import '../helpers/utils';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  first: Date;
  second: Date;
  third: Date;
  start: Observable<Moment.Moment>;
  title: Observable<string>;
  rosters: Observable<IRoster[]>;
  select: Observable<string[]>;
  ngOnInit() {
  }
  constructor(
    public store: Store<IState>
  ) {
    this.first = new Date();
    this.first.setDate(1);
    this.second = this.first.addMonths(1);
    this.third = this.first.addMonths(2);
    this.start = store.select<Moment.Moment>(s => s.app.start);
    this.title = store.select<string>(s => s.app.calendarTitle);
    this.rosters = store.select<IRoster[]>(s => s.app.rosters);
    this.select = store.select<string[]>(s => s.app.select);
  }
}
