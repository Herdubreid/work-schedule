import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { SignonService, StatusTypes } from 'e1-service';
import * as Moment from 'moment';

import { IState } from './store/state';
import { AppActions } from './store/actions';
import { SignonPromptComponent } from './e1/signon-prompt.component';

declare var AIS_BASE_URL;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  status: Observable<string>;
  mode: Observable<string>;
  constructor(
    http: Http,
    dlg: MatDialog,
    store: Store<IState>,
    signon: SignonService
  ) {
    signon.baseUrl = AIS_BASE_URL;
    this.status = store.select<string>(s => s.e1.status);
    this.mode = store.select<string>(s => s.app.mode);
    this.status
      .subscribe(status => {
        if (status === StatusTypes.STATUS_OFF) {
          if (signon.baseUrl.localeCompare('DEMO') === 0) {
            http.get('https://herdubreid.github.io/work-schedule/docs/demo.json')
              .map(response => response.json())
              .subscribe(app => {
                store.dispatch(new AppActions.LoadDemoAction(app));
                const d = Moment('2017-11-13', 'YYYY-MM-DD');
                store.dispatch(new AppActions.StartEndAction(d, d));
              });
          } else {
            dlg.open(SignonPromptComponent, {
              disableClose: true,
              width: '250px'
            });
          }
        }
      });
  }
}
