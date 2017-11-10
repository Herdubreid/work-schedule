import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { reduce, map, filter } from 'rxjs/operators';
import * as $ from 'jquery';
import * as Moment from 'moment';
import 'fullcalendar';

import { IState, IRoster } from '../store/state';
import { AppActions } from '../store/actions';
import '../helpers/utils';

interface IActivity {
    cd1: string;
    activity: string;
    title: string;
}
interface IEvent extends FC.EventObject {
    activities: IActivity[];
}
export interface ICalendar {
    selection: string[];
    rosters: IRoster[]
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
                const regular = event.activities.filter(e => e.activity.localeCompare('REGULAR') === 0);
                const holiday = event.activities.filter(e => e.activity.localeCompare('HOLIDAY') === 0);
                if (regular.length > 0) {
                    const d = regular.filter(e => e.cd1 === 'D').length;
                    const n = regular.filter(e => e.cd1 === 'N').length;
                    element.html(`<div>${d > 0 ? 'D'+d : ''} ${n > 0 ? 'N'+n : ''}</div>`);
                }
                if (holiday.length > 0) {
                    element.css('background-color', 'green');
                    element.html(`<div>Leave (${holiday.length})</div>`);
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
        this.display
            .filter(display => display.selection.length > 0)
            .subscribe(display => {
                const events = display.rosters
                    .filter(r => display.selection.includes(r.an8))
                    .reduce<IEvent[]>((events, r) => {
                        const node = events.find(e => r.start.diff(e.start) === 0) ||
                            events[events.push({ start: r.start, title: 'Events', activities: [] }) - 1];
                        node.activities.push({
                            cd1: r.cd1,
                            activity: r.activity,
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
