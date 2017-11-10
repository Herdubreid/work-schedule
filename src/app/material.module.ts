import { NgModule } from '@angular/core';

import {
    MatSidenavModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatDialogModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule
} from '@angular/material';

@NgModule({
    imports: [
        MatSidenavModule,
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        MatDialogModule,
        MatToolbarModule,
        MatProgressBarModule,
        MatCardModule,
        MatIconModule,
        MatMenuModule
    ],
    exports: [
        MatSidenavModule,
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        MatDialogModule,
        MatToolbarModule,
        MatProgressBarModule,
        MatCardModule,
        MatIconModule,
        MatMenuModule
    ]
})
export class MaterialModule { }
