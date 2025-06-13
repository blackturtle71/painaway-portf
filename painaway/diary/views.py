from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .permissions import IsPatient
from .models import Note, BodyStats, BodyPart
from .serializers import NoteSerializer, BodyStatsSerializer, BodyPartSerializer

class NotesView(APIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        notes = Note.objects.filter(owner=user).order_by("created_on")
        serializer = self.serializer_class(notes, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        title = request.data.get('title')
        body = request.data.get('body')
        
        if not title or not body:
            return Response({'error': 'Title and note body are required'})
        note = Note.objects.create(owner=request.user, title=title, body=body)
        serializer = self.serializer_class(note)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def patch(self, request):
        pk = request.data.get('note_pk')

        try:
            note = Note.objects.get(pk=pk, owner=request.user)
        except Note.DoesNotExist:
            return Response({"error": 'Note not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.serializer_class(note, data=request.data, partial=True) # allow partial modifications

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        pk = request.data.get('note_pk')

        try:
            note = Note.objects.get(pk=pk, owner=request.user)
        except Note.DoesNotExist:
            return Response({"error": 'Note not found'}, status=status.HTTP_404_NOT_FOUND)
        
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class BodyPartsView(APIView):
    def get(self, request):
        body_parts = BodyPart.objects.all()
        serializer = BodyPartSerializer(body_parts, many=True)
        return Response(serializer.data)
    
class BodyStatsView(APIView):
    serializer_class = BodyStatsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        stats = BodyStats.objects.filter(owner=user).order_by("date_recorded")
        serializer = self.serializer_class(stats, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = BodyStatsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        pk = request.data.get('stat_pk')
        try:
            stat = BodyStats.objects.get(pk=pk, owner=request.user)
        except BodyStats.DoesNotExist:
            return Response({"error": 'Stat not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.serializer_class(stat, data=request.data, partial=True) # allow partial modifications

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        pk = request.data.get('stat_pk')

        try:
            stat = BodyStats.objects.get(pk=pk, owner=request.user)
        except BodyStats.DoesNotExist:
            return Response({"error": 'stat not found'}, status=status.HTTP_404_NOT_FOUND)
        
        stat.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
        
