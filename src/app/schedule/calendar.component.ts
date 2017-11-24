import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/combineLatest';
import { reduce, map, combineLatest } from 'rxjs/operators';
import * as $ from 'jquery';
import * as Moment from 'moment';
import 'fullcalendar';

import { IState, IRoster } from '../store/state';
import { AppActions } from '../store/actions';
import '../helpers/utils';

interface IActivity {
    cd1: string;
    title: string;
}
interface IEvent extends FC.EventObject {
    type: string;
    activities: IActivity[];
}
export interface ICalendar {
    selection: string[];
    rosters: IRoster[];
}

@Component({
    selector: 'app-calendar',
    template: '',
    styleUrls: ['./schedule.component.scss']
})
export class CalendarComponent implements OnInit {
    @Input('start') start: Date;
    @Input('header') header: boolean;
    @Input('footer') footer: boolean;
    @Input('rosters') rosters: Observable<IRoster[]>;
    @Input('select') select: Observable<string[]>;
    @Input('display') display: Observable<ICalendar>;
    ngOnInit() {
        const header = this.header ? {
            left: 'title',
            center: '',
            right: ''
        } : false;
        const footer = this.footer ? {
            left: '',
            center: '',
            right: 'title'
        } : false;
        $(this.host.nativeElement).fullCalendar({
            header,
            footer,
            defaultDate: this.start,
            nextDayThreshold: Moment.duration('10:00'),
            height: 'auto',
            showNonCurrentDates: false,
            fixedWeekCount: false,
            weekNumbers: true,
            aspectRatio: 1,
            allDayDefault: true,
            selectable: true,
            select: (start, end, jsEvent, view) => {
                this.store.dispatch(new AppActions.StartEndAction(start, end));
            },
            eventRender: (event: IEvent, element: any, view) => {
                element.css('font-size', '.6em');
                if (event.type.localeCompare('REGULAR') === 0) {
                    const d = event.activities.filter(e => e.cd1 === 'D').length;
                    const n = event.activities.filter(e => e.cd1 === 'N').length;
                    element.html(`<div>${d > 0 ? 'D' + d : ''} ${n > 0 ? 'N' + n : ''}</div>`);
                }
                if (event.type.localeCompare('HOLIDAY') === 0) {
                    element.css('background-color', 'green');
                    element.html(`<div>${event.activities.length > 1 ? 'Holday...' : event.activities[0].title}</div>`);
                }
                element.qtip({
                    content: event.activities.map(e => `<div>${e.title}</div>`).sort()
                });
            },
            viewRender: (view, element) => {
                if (!this.header) {
                    element.find('.fc-head').remove();
                }
            }
        });
        Observable
            .combineLatest(this.rosters, this.select)
            .filter(([rosters, select]) => select.length > 0)
            .subscribe(([rosters, select]) => {
                const events = rosters
                    .filter(r => select.includes(r.an8))
                    .reduce<IEvent[]>((events, r) => {
                        const node = events.find(e => (r.start.diff(e.start) === 0 && r.activity.localeCompare(e.type)) === 0) ||
                            events[events.push({ start: r.start, title: 'Events', type: r.activity, activities: [] }) - 1];
                        node.activities.push({
                            cd1: r.cd1,
                            title: r.title
                        });
                        return events;
                    }, []);
                $(this.host.nativeElement).fullCalendar('removeEvents');
                $(this.host.nativeElement).fullCalendar('addEventSource', {
                    events
                });
            });
    }
    constructor(
        public host: ElementRef,
        public store: Store<IState>
    ) {
    }
}
