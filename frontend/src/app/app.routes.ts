import { Routes } from '@angular/router';
import { MeetingsListComponent } from './components/meetings-list/meetings-list.component';
import { MeetingDetailComponent } from './components/meeting-detail/meeting-detail.component';

export const routes: Routes = [
    { path: 'meetings', component: MeetingsListComponent },
    { path: 'meetings/:id', component: MeetingDetailComponent },
    { path: '', redirectTo: '/meetings', pathMatch: 'full' }
];