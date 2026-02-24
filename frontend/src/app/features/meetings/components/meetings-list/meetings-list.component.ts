import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MeetingService } from '../../services/meeting.service';
import { Meeting } from '../../models/meeting.models';

@Component({
  selector: 'meetings-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './meetings-list.component.html',
  styleUrl: './meetings-list.component.css'
})
export class MeetingsListComponent implements OnInit {
  meetings: Meeting[] = [];
  loading = true;

  constructor(private meetingService: MeetingService) { }

  ngOnInit() {
    this.fetchMeetings();
  }

  fetchMeetings() {
    this.meetingService.getMeetings(1).subscribe({
      next: (res) => {
        this.meetings = res.results;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load meetings', err);
        this.loading = false;
      }
    });
  }
}
