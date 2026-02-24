import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Meeting, Note, PaginatedResponse, Summary } from '../models/meeting.models';

@Injectable({
    providedIn: 'root'
})
export class MeetingService {
    private apiUrl = '/api';

    constructor(private http: HttpClient) { }

    getMeetings(page: number = 1): Observable<PaginatedResponse<Meeting>> {
        return this.http.get<PaginatedResponse<Meeting>>(`${this.apiUrl}/meetings/?page=${page}`);
    }

    getMeeting(id: number): Observable<Meeting> {
        return this.http.get<Meeting>(`${this.apiUrl}/meetings/${id}/`);
    }

    getNotes(meetingId: number, page: number = 1): Observable<PaginatedResponse<Note>> {
        return this.http.get<PaginatedResponse<Note>>(`${this.apiUrl}/meetings/${meetingId}/notes/?page=${page}`);
    }

    addNote(meetingId: number, author: string, text: string): Observable<Note> {
        return this.http.post<Note>(`${this.apiUrl}/meetings/${meetingId}/notes/`, { author, text });
    }

    summarize(meetingId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/meetings/${meetingId}/summarize/`, {});
    }

    getSummary(meetingId: number): Observable<Summary> {
        return this.http.get<Summary>(`${this.apiUrl}/meetings/${meetingId}/summary/`);
    }
}
