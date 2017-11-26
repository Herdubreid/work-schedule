import { Component, OnInit, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map, filter, reduce, withLatestFrom } from 'rxjs/operators';
import * as $ from 'jquery';
import 'jstree';

import { IState, IMCU, ISchedule, IEmployee } from '../store/state';
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
    appStatus: Observable<string>;
    getAN8s(an8s: string[], node: ITreeNode) {
        if (node.children.length > 0) {
            node.children.forEach(n => this.getAN8s(an8s, $(this.host.nativeElement).jstree(true).get_node(n)));
        } else {
            an8s.push(node.data.an8);
        }
    }
    ngOnInit() {
        $(this.host.nativeElement).jstree({ core: { data: [] } });
        this.appStatus
            .filter(status => status.localeCompare('READY') === 0)
            .withLatestFrom(this.store)
            .subscribe(([status, store]) => {
                const schedules = store.app.schedules.reduce<ITreeNode[]>((data, r) => {
                    const mcu = data.find(e => e.data.mcu.localeCompare(r.mcu) === 0) ||
                        data[data.push({
                            text: `${r.mcu} - ${store.app.mcus.find(m => m.mcu.localeCompare(r.mcu) === 0)
                                ? store.app.mcus.find(m => m.mcu.localeCompare(r.mcu) === 0).title : 'n/a'}`,
                            data: { mcu: r.mcu },
                            children: []
                        }) - 1];
                    mcu.children.push({ text: `${r.alph} (${r.an8})`, data: { an8: r.an8 } });
                    return data;
                }, []);
                const employees = store.app.employees.reduce<ITreeNode[]>((data, r) => {
                    const hmco = data.find(e => e.data.hmco.localeCompare(r.hmco) === 0) ||
                        data[data.push({
                            id: r.hmco,
                            text: r.hmco,
                            data: { hmco: r.hmco },
                            children: []
                        }) - 1];
                    const hmcu = hmco.children.find(e => e.data.hmcu.localeCompare(r.hmcu) === 0) ||
                        hmco.children[hmco.children.push({
                            text: `${r.hmcu} - ${store.app.mcus.find(m => m.mcu.localeCompare(r.hmcu) === 0)
                                ? store.app.mcus.find(m => m.mcu.localeCompare(r.hmcu) === 0).title : 'n/a'}`,
                            data: { hmco: r.hmco, hmcu: r.hmcu },
                            children: []
                        }) - 1];
                    const crew = hmcu.children.find(e => e.data.shft.localeCompare(r.shft) === 0) ||
                        hmcu.children[hmcu.children.push({
                            text: `${r.shft} - ${r.shftT}`,
                            data: { hmco: r.hmco, hmcu: hmcu.data.hmcu, shft: r.shft },
                            children: []
                        }) - 1];
                    crew.children.push({ text: `${r.alph} (${r.an8})`, data: { an8: r.an8 } });
                    return data;
                }, []);
                $(this.host.nativeElement).jstree(true).destroy();
                const data: ITreeNode[] = [{
                    text: '1 - Schedules',
                    data: {},
                    children: schedules
                },
                {
                    id: 'rosters',
                    text: '2 - Rosters',
                    data: {},
                    children: employees
                }];
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
                    let an8s = [];
                    this.getAN8s(an8s, data.node);
                    this.store.dispatch(new AppActions.SelectRosterAction(data.node.text, an8s));
                });
                this.search.subscribe(s => {
                    $(this.host.nativeElement).jstree(true).search(s);
                });
                $(this.host.nativeElement).on('loaded.jstree', () => {
                    $(this.host.nativeElement).jstree(true).select_node('rosters');
                })
            });
    }
    constructor(
        public host: ElementRef,
        public store: Store<IState>
    ) {
        this.appStatus = store.select<string>(s => s.app.status);
        this.search = store.select(s => s.app.search);
    }
}
