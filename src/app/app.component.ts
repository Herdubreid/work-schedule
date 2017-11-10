import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { SignonService, StatusTypes } from 'e1-service';

import { IState } from './store/state';
import { SignonPromptComponent } from './e1/signon-prompt.component';

declare var AIS_BASE_URL;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  status: Observable<string>;
  constructor(
    dlg: MatDialog,
    store: Store<IState>,
    signon: SignonService
  ) {
    signon.baseUrl = AIS_BASE_URL;
    this.status = store.select<string>(s => s.e1.status);
    this.status
      .subscribe(status => {
        if (status === StatusTypes.STATUS_OFF) {
          dlg.open(SignonPromptComponent, {
            disableClose: true,
            width: '250px'
          });
        }
      });
  }
}
