import { Component, OnInit, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map, reduce, withLatestFrom } from 'rxjs/operators';
import * as $ from 'jquery';
import 'jstree';

import { IState, IMCU, IUDC, ISchedule, IEmployee } from '../store/state';
import { AppActions } from '../store/actions';
import '../helpers/utils';

interface ITreeNode {
    id?: any;
    data?: any;
    text: string;
    state?: {
        opened?: boolean;
        disabled?: boolean;
        selected?: boolean;
    };
    a_attr?: any,
    children?: ITreeNode[];
}

@Component({
    selector: 'app-tree',
    template: '',
    styleUrls: ['./schedule.component.scss']
})
export class TreeComponent implements OnInit {
    search: Observable<string>;
    employees: Observable<IEmployee[]>;
    ngOnInit() {
        $(this.host.nativeElement).jstree({ core: { data: [] } });
        this.employees
            .withLatestFrom(this.store)
            .subscribe(([employees, store]) => {
                if (employees.length) {
                    const udc = store.app.udcs.filter(r => r.sy === '06' && r.rt === '13');
                    const data = employees.reduce<ITreeNode[]>((data, r) => {
                        const hmco = data.find(e => e.data.hmco.localeCompare(r.hmco) === 0) ||
                            data[data.push({
                                id: r.hmco,
                                text: r.hmco,
                                data: { hmco: r.hmco },
                                children: []
                            }) - 1];
                        const hmcu = hmco.children.find(e => e.data.hmcu.localeCompare(r.hmcu) === 0) ||
                            hmco.children[hmco.children.push({
                                text: `${r.hmcu} - ${store.app.mcus.find(m => m.mcu.localeCompare(r.hmcu) === 0) ? store.app.mcus.find(m => m.mcu.localeCompare(r.hmcu) === 0).title : 'n/a'}`,
                                data: { hmco: r.hmco, hmcu: r.hmcu },
                                children: []
                            }) - 1];
                        const crew = hmcu.children.find(e => e.data.udc.localeCompare(r.p013) === 0) ||
                            hmcu.children[hmcu.children.push({
                                text: `${r.p013} - ${udc.find(c => c.code === r.p013) ? udc.find(c => c.code === r.p013).title : 'n/a'}`,
                                data: { hmco: r.hmco, hmcu: hmcu.data.hmcu, udc: r.p013 },
                                children: []
                            }) - 1];
                        crew.children.push({ text: `${r.alph} (${r.an8})`, data: { an8: r.an8 } });
                        return data;
                    }, []);
                    $(this.host.nativeElement).jstree(true).destroy();
                    $(this.host.nativeElement).jstree({
                        core: { data },
                        types: {
                            default: {
                                icon: false
                            }
                        },
                        plugins: ['sort', 'search', 'types']
                    });
                    $(this.host.nativeElement).on('select_node.jstree', (e, data) => {
                        if (data.node.data.hmco) {
                            let mcu: string[];
                            let udc: string[];
                            if (data.node.data.hmcu) {
                                mcu = [data.node.data.hmcu];
                                if (data.node.data.udc) {
                                    udc = data.node.data.udc;
                                } else {
                                    udc = data.node.children
                                        .map(n => $(this.host.nativeElement).jstree(true).get_node(n).data.udc);
                                }
                                this.store.dispatch(new AppActions.SelectRosterAction(
                                    data.node.text,
                                    store.app.schedules.filter(r => mcu.includes(r.mcu) && udc.includes(r.ac23))
                                        .map(r => r.an8)
                                ));
                            } else {
                                mcu = data.node.children
                                    .map(n => $(this.host.nativeElement).jstree(true).get_node(n).data.hmcu);
                                this.store.dispatch(new AppActions.SelectRosterAction(
                                    data.node.text,
                                    store.app.schedules.filter(r => mcu.includes(r.mcu))
                                        .map(r => r.an8)
                                ));
                            }
                        }
                        if (data.node.data.an8) {
                            this.store.dispatch(new AppActions.SelectRosterAction(
                                data.node.text,
                                [data.node.data.an8]));
                        }
                    });
                    this.search.subscribe(s => {
                        $(this.host.nativeElement).jstree(true).search(s);
                    });
                    $(this.host.nativeElement).on('loaded.jstree', () => {
                        $(this.host.nativeElement).jstree(true).select_node(employees[0].hmco);
                    })
                }
            });
    }
    constructor(
        public host: ElementRef,
        public store: Store<IState>
    ) {
        this.employees = store.select<IEmployee[]>(s => s.app.employees);
        this.search = store.select(s => s.app.search);
    }
}
