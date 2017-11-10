import { Component, OnInit, } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as Moment from 'moment';

import { IState, IRoster } from '../store/state';
import { ICalendar } from './calendar.component';
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
  calendar: Observable<ICalendar>;
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
    this.calendar = store.select<ICalendar>(s => {
      return {
        selection: s.app.select,
        rosters: s.app.rosters
      };
    });
  }
}
