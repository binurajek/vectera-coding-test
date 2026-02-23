import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MeetingsListComponent } from './components/meetings-list/meetings-list.component';
import { MeetingDetailComponent } from './components/meeting-detail/meeting-detail.component';
import { MeetingService } from './services/meeting.service';
import { routes } from './app.routes';



@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    MeetingsListComponent,
    MeetingDetailComponent
  ],
  providers: [MeetingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
