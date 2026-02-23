import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'meetings-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './meetings-list.component.html',
  styleUrl: './meetings-list.component.css'
})
export class MeetingsListComponent implements OnInit {

  ngOnInit() {
    this.fetchMeetings();
  }

  fetchMeetings() {

  }
}
