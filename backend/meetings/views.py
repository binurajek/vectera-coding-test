import logging
import threading
from django.db import connection
from django.db.models import Count
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, action
from rest_framework.response import Response

from .models import Meeting, Note, Summary
from .serializers import MeetingSerializer, NoteSerializer, SummarySerializer

log = logging.getLogger(__name__)

@api_view(["GET"])
def health(request):
    return Response({"status": "ok"}, status=status.HTTP_200_OK)


def generate_summary_background(meeting_id):
    """
    Simulated async job to generate summary.
    """
    from .services.ai import summarize
    
    try:
        meeting = Meeting.objects.get(id=meeting_id)
        summary = meeting.summary
        
        notes = list(Note.objects.filter(meeting=meeting).order_by('created_at'))
        all_notes_text = "\n".join([note.text for note in notes])
            
        result = summarize(all_notes_text)
        
        summary.content = result
        summary.status = "ready"
        summary.save()
        
    except Exception as e:
        log.error(f"An error occurred while making the summary: {e}")
        try:
            summary = Summary.objects.get(meeting_id=meeting_id)
            summary.status = "failed"
            summary.save()
        except:
            pass
            
    finally:
        connection.close()


class MeetingViewSet(viewsets.ModelViewSet):
    """
    - list with pagination (newest first)
    - retrieve (include latest summary if any)
    - create
    """
    queryset = Meeting.objects.all().annotate(note_count=Count("notes")).order_by('-started_at')
    serializer_class = MeetingSerializer

    @action(detail=True, methods=["get", "post"], url_path="notes")
    def notes(self, request, pk=None):
        """
        Validate and create a Note for this meeting (POST).
        Return paginated notes, ordered oldest..newest (GET).
        """
        meeting = self.get_object()
        
        if request.method == "POST":
            serializer = NoteSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(meeting=meeting)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        elif request.method == "GET":
            notes = Note.objects.filter(meeting=meeting).order_by('created_at')
            page = self.paginate_queryset(notes)
            if page is not None:
                serializer = NoteSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            serializer = NoteSerializer(notes, many=True)
            return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="summarize")
    def summarize(self, request, pk=None):
        """
        - Create or update a Summary with status 'pending'
        - Simulate async job: concatenate notes, call services.ai.summarize, then set 'ready'/'failed'
        - Log meeting_id and note_count
        - Return 202 Accepted
        """
        meeting = self.get_object()
        log.info("summarize_requested", extra={"meeting_id": meeting.id, "note_count": meeting.notes.count()})
        
        try:
            summary = Summary.objects.get(meeting=meeting)
        except Summary.DoesNotExist:
            summary = Summary(meeting=meeting)
            
        summary.status = "pending"
        summary.save()

        thread = threading.Thread(target=generate_summary_background, args=(meeting.id,))
        thread.start()

        return Response({"detail": "Accepted"}, status=status.HTTP_202_ACCEPTED)

    @action(detail=True, methods=["get"], url_path="summary")
    def get_summary(self, request, pk=None):
        """
        Return the summary or 404 if none.
        """
        meeting = self.get_object()
        
        try:
            summary = Summary.objects.get(meeting=meeting)
            serializer = SummarySerializer(summary)
            return Response(serializer.data)
        except Summary.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
