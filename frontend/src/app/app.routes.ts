import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'meetings', loadChildren: () => import('./features/meetings/meetings.module').then(m => m.MeetingsModule) },
    { path: '', redirectTo: '/meetings', pathMatch: 'full' }
];