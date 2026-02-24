import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MeetingService } from '../../services/meeting.service';
import { Meeting, Note, Summary } from '../../models/meeting.models';
import { interval, Subscription } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'meeting-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './meeting-detail.component.html',
  styleUrl: './meeting-detail.component.css'
})

export class MeetingDetailComponent implements OnInit, OnDestroy {
  meetingId!: number;
  meeting: Meeting | null = null;
  notes: Note[] = [];
  summary: Summary | null = null;
  loading = true;
  error = '';
  newNoteAuthor = '';
  newNoteText = '';
  addingNote = false;
  generatingSummary = false;

  private pollingSub: Subscription | null = null;

  constructor(private route: ActivatedRoute,
    private meetingService: MeetingService) { }

  ngOnInit() {
    this.meetingId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();
  }

  loadData() {
    this.meetingService.getMeeting(this.meetingId).subscribe({
      next: (m) => {
        this.meeting = m;
        this.summary = m.latest_summary;
        if (this.summary?.status === 'pending') {
          this.startPolling();
        }
      },
      error: () => {
        this.error = 'Failed to load meeting details.';
        this.loading = false;
      }
    });

    this.meetingService.getNotes(this.meetingId, 1).subscribe({
      next: (res) => {
        this.notes = res.results;
        this.loading = false;
      },
      error: () => {
        if (!this.error) this.error = 'Failed to load notes.';
        this.loading = false;
      }
    });
  }

  addNote() {
    if (!this.newNoteAuthor || !this.newNoteText) return;
    this.addingNote = true;
    this.meetingService.addNote(this.meetingId, this.newNoteAuthor, this.newNoteText).subscribe({
      next: (note) => {
        this.notes.push(note);
        this.newNoteAuthor = '';
        this.newNoteText = '';
        this.addingNote = false;
        if (this.meeting) this.meeting.note_count++;
      },
      error: () => this.addingNote = false
    });
  }

  generateSummary() {
    this.generatingSummary = true;
    this.meetingService.summarize(this.meetingId).subscribe({
      next: () => {
        this.generatingSummary = false;
        if (this.summary) {
          this.summary.status = 'pending';
        } else {
          this.summary = { id: 0, content: '', status: 'pending', created_at: '', updated_at: '' };
        }
        this.startPolling();
      },
      error: () => this.generatingSummary = false
    });
  }

  startPolling() {
    if (this.pollingSub) return;
    this.pollingSub = interval(2000)
      .pipe(switchMap(() => this.meetingService.getSummary(this.meetingId)),
        takeWhile(res => res && res.status === 'pending', true))
      .subscribe({
        next: (res) => {
          this.summary = res;
          if (res.status !== 'pending') {
            this.pollingSub?.unsubscribe();
            this.pollingSub = null;
          }
        },
        error: () => {
          this.pollingSub?.unsubscribe();
          this.pollingSub = null;
        }
      });
  }

  ngOnDestroy() {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
  }
}
