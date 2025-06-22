from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import BodyStats, BodyPart, PatientDoctorLink
from .serializers import BodyStatsSerializer, BodyPartSerializer
from .permissions import IsPatientOrLinkedDoc, IsDoctor
from authentication.models import CustomUser

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
        patient_id = request.query_params.get("patient_id")

        if user.groups.filter(name="Doctor").exists():
            linked_patient_ids = PatientDoctorLink.objects.filter(
                doctor=user, status="accepted"
            ).values_list("patient_id", flat=True)

            if patient_id:
                if int(patient_id) not in linked_patient_ids:
                    return Response({"detail": "Not authorized to view this patient."}, status=status.HTTP_403_FORBIDDEN)
                stats = BodyStats.objects.filter(owner__id=patient_id).order_by("date_recorded")
        else:
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
    
class SendDoctorRequestView(APIView):
    permissions_classes = [permissions.IsAuthenticated, IsPatientOrLinkedDoc]

    def post(self, request):
        doc_username = request.data.get('doc_username')
        try:
            doc = CustomUser.objects.get(username=doc_username)
            if not doc.groups.filter(name='Doctor').exists():
                return Response({"error": "user is not a doctor"}, status=status.HTTP_400_BAD_REQUEST)
            
            link, created = PatientDoctorLink.objects.get_or_create(patient=request.user, doctor=doc)
            if not created:
                return Response({'error': 'Request already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            return Response({'detail': "Request sent"}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)
    
class RespondToPatientRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsDoctor]

    def post(self, request):
        patient_id = request.data.get('patient_id')
        action = request.data.get('action') 
        try:
            link = PatientDoctorLink.objects.get(patient_id=patient_id, doctor=request.user)
            if action == 'accept':
                link.status = 'accepted'
            elif action == 'reject':
                link.status = 'rejected'
            else:
                return Response({'error': 'Invalid action.'}, status=status.HTTP_400_BAD_REQUEST)
            link.save()
            return Response({'detail': f'Request {action}ed.'}, status=status.HTTP_200_OK)
        except PatientDoctorLink.DoesNotExist:
            return Response({'error': 'Request not found.'}, status=status.HTTP_404_NOT_FOUND)

