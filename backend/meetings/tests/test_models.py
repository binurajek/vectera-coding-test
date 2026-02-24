import pytest
from django.utils import timezone
from meetings.models import Meeting, Note, Summary

@pytest.mark.django_db
def test_meeting_ordering():
    m1 = Meeting.objects.create(title="Older Meeting", started_at=timezone.now() - timezone.timedelta(days=1))
    m2 = Meeting.objects.create(title="Newer Meeting", started_at=timezone.now())
    
    meetings = list(Meeting.objects.all())
    assert meetings[0] == m2
    assert meetings[1] == m1

@pytest.mark.django_db
def test_note_creation():
    m = Meeting.objects.create(title="Meeting", started_at=timezone.now())
    n = Note.objects.create(meeting=m, author="Abhiraj", text="First note")
    o = Note.objects.create(meeting=m, author="Binuraj", text="Second note")
    
    assert m.notes.count() == 2
    assert m.notes.first() == n
