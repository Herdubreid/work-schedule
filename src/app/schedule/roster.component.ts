import { Component, OnInit, } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter, withLatestFrom } from 'rxjs/operators';
import * as Moment from 'moment';

import { IState, IRoster, IEmployee } from '../store/state';
import { AppActions } from '../store/actions';
import '../helpers/utils';

@Component({
  selector: 'app-roster',
  template: `
<div *ngIf="dayshift.length > 0">
  <h4>Dayshift:</h4>
  <div *ngFor="let e of dayshift">
    <button mat-button (click)="search(e)">{{ e.alph }} ({{ e.an8 }})</button>
  </div>
<div *ngIf="nightshift.length > 0">
  <h4>Nightshift:</h4>
  <div *ngFor="let e of nightshift">
    <button mat-button (click)="search(e)">{{ e.alph }} ({{ e.an8 }})</button>
  </div>
<div *ngIf="leave.length > 0">
  <h4>Leave:</h4>
  <div *ngFor="let e of leave">
    <button mat-button (click)="search(e)">{{ e.alph }} ({{ e.an8 }})</button>
  </div>
</div>
`,
  styleUrls: ['./schedule.component.scss']
})
export class RosterComponent implements OnInit {
  start: Observable<Moment.Moment>;
  roster: IRoster[];
  dayshift: IEmployee[];
  nightshift: IEmployee[];
  leave: IEmployee[];
  search(e: IEmployee) {
    this.store.dispatch(new AppActions.SearchAction(e.an8));
  }
  ngOnInit() {
    this.start
      .withLatestFrom(this.store)
      .subscribe(([start, store]) => {
        this.roster = store.app.rosters.filter(r => r.start.diff(start, 'days') === 0);
        this.dayshift = store.app.employees
          .filter(e => this.roster
            .filter(r => e.an8.localeCompare(r.an8) === 0)
            .filter(r => r.activity.localeCompare('REGULAR') === 0)
            .filter(r => r.cd1 === 'D').length > 0)
          .sort((a, b) => a.alph.localeCompare(b.alph));
        this.nightshift = store.app.employees
          .filter(e => this.roster
            .filter(r => e.an8.localeCompare(r.an8) === 0)
            .filter(r => r.activity.localeCompare('REGULAR') === 0)
            .filter(r => r.cd1 === 'N').length > 0)
          .sort((a, b) => a.alph.localeCompare(b.alph));
        this.leave = store.app.employees
          .filter(e => this.roster
            .filter(r => e.an8.localeCompare(r.an8) === 0)
            .filter(r => r.activity.localeCompare('HOLIDAY') === 0)
            .filter(r => r.start.diff(start, 'days') === 0).length > 0)
          .sort((a, b) => a.alph.localeCompare(b.alph));
      });
  }
  constructor(
    public store: Store<IState>
  ) {
    this.start = store.select<Moment.Moment>(s => s.app.start);
  }
}
