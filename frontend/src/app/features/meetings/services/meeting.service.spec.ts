import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MeetingService } from './meeting.service';
import { Meeting } from '../models/meeting.models';

describe('MeetingService', () => {
    let service: MeetingService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MeetingService]
        });
        service = TestBed.inject(MeetingService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch meeting details', () => {
        const dummyMeeting: Meeting = {
            id: 1,
            title: 'Strategy Sync',
            started_at: '2026-02-23T10:00:00Z',
            created_at: '2026-02-23T10:00:00Z',
            note_count: 0,
            latest_summary: null
        };

        service.getMeeting(1).subscribe(meeting => {
            expect(meeting).toEqual(dummyMeeting);
        });

        const req = httpMock.expectOne('/api/meetings/1/');
        expect(req.request.method).toBe('GET');
        req.flush(dummyMeeting);
    });
});
