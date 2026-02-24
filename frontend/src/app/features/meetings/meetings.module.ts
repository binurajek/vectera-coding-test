import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MeetingsListComponent } from './components/meetings-list/meetings-list.component';
import { MeetingDetailComponent } from './components/meeting-detail/meeting-detail.component';

const routes: Routes = [
    { path: '', component: MeetingsListComponent },
    { path: ':id', component: MeetingDetailComponent }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MeetingsListComponent,
        MeetingDetailComponent
    ]
})
export class MeetingsModule { }
