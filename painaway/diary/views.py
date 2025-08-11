from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from django.core.cache import cache
from .models import BodyStats, BodyPart, PatientDoctorLink, Prescription, Diagnosis, Notification
from .serializers import BodyStatsSerializer, BodyPartSerializer, PatientDoctorLinkSerializer, PrescriptionSerializer, DiagnosisSerializer, NotificationSerializer
from .permissions import IsPatientOrLinkedDoc, IsDoctor
from authentication.models import CustomUser
from .utils import create_notification

class BodyPartsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
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
        user = request.user
        serializer = BodyStatsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)

            active_links = PatientDoctorLink.objects.filter(
                patient=user, status="accepted"
            ).select_related('doctor') # select related does some SQL optimization
            for link in active_links:
                create_notification(user=link.doctor, message=f"Новая запись от {user.full_name}")

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
            
            create_notification(user=doc, message=f'Новый запрос на прикрепление от {request.user.full_name}')
            return Response({'detail': "Request sent"}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)
    
class RespondToPatientRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsDoctor]

    def post(self, request):
        patient_id = request.data.get('patient_id')
        action = request.data.get('action') 
        try:
            link = PatientDoctorLink.objects.get(patient__id=patient_id, doctor=request.user)
            if action == 'accept':
                link.status = 'accepted'
                create_notification(user=link.patient, message=f"Доктор {request.user.full_name} принял заявку.")
            elif action == 'reject':
                create_notification(user=link.patient, message=f"Доктор {request.user.full_name} отклонил заявку.")
                link.status = 'rejected'
            else:
                return Response({'error': 'Invalid action.'}, status=status.HTTP_400_BAD_REQUEST)
            link.save()
            return Response({'detail': f'Request {action}ed.'}, status=status.HTTP_200_OK)
        except PatientDoctorLink.DoesNotExist:
            return Response({'error': 'Request not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request):
        patient_id = request.data.get('patient_id')
        try:
            link = PatientDoctorLink.objects.get(patient__id=patient_id, doctor=request.user)
            link.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except PatientDoctorLink.DoesNotExist:
            return Response({'error': 'Request does not exists'}, status=status.HTTP_404_NOT_FOUND)

class ListLinksView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        links = PatientDoctorLink.objects.filter(
            Q(patient=user) | Q(doctor=user)
        ).select_related('patient', 'doctor')

        serializer = PatientDoctorLinkSerializer(links, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class PrescriptionView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PrescriptionSerializer

    def get(self, request):
        user = request.user
        link_id = request.query_params.get("link_id")

        try:
            link = PatientDoctorLink.objects.get(Q(patient=user, id=link_id) | Q(doctor=user, id=link_id))
            if link.status == 'accepted':
                prescription = Prescription.objects.filter(link=link)
                serializer = self.serializer_class(prescription, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "link not accepted"}, status=403)

        except PatientDoctorLink.DoesNotExist:
            return Response({"error": "link not found"}, status=404)
        
    def post(self, request):
        user = request.user
        link_id = request.query_params.get("link_id")

        try:
            link = PatientDoctorLink.objects.get(Q(doctor=user, id=link_id))
            if link.status == 'accepted':
                serializer = PrescriptionSerializer(data=request.data)
                if serializer.is_valid():
                    serializer.save(link=link)
                    create_notification(user=link.patient, message=f"Доступны новые рекомендации по лечению.")
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=400)
            else:
                return Response({"error": "link not accepted"}, status=403)

        except PatientDoctorLink.DoesNotExist:
            return Response({"error": "link not found"}, status=404)
        
    def patch(self, request):
        user = request.user
        prescription_id = request.query_params.get("prescription_id")

        try:
            prescription = Prescription.objects.get(id=prescription_id)
            if user == prescription.link.doctor:
                serializer = PrescriptionSerializer(prescription, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    create_notification(user=prescription.link.patient, message=f"Доктор изменил ваши рекомендации по лечению.")
                    return Response(serializer.data, status=200)
                return Response(serializer.errors, status=400)
            return Response({"error": "Not authorized to edit this prescription."}, status=403)
        except Prescription.DoesNotExist:
            return Response({'error': 'prescription not found'}, status=404)
    
    def delete(self, request):
        user = request.user
        prescription_id = request.query_params.get("prescription_id")

        try:
            prescription = Prescription.objects.get(id=prescription_id)
            if user == prescription.link.doctor:
                prescription.delete()                
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response({"error": "Not authorized to delete this prescription."}, status=403)
        except Prescription.DoesNotExist:
            return Response({'error': 'prescription not found'}, status=404)

class DiagnosisView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DiagnosisSerializer

    def get(self, request):
        user = request.user
        link_id = request.query_params.get("link_id")

        try:
            link = PatientDoctorLink.objects.get(Q(patient=user, id=link_id) | Q(doctor=user, id=link_id))
            if link.status == 'accepted':
                diagnosis = Diagnosis.objects.filter(link=link)
                serializer = self.serializer_class(diagnosis, many=True)                    
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "link not accepted"}, status=403)

        except PatientDoctorLink.DoesNotExist:
            return Response({"error": "link not found"}, status=404)
        
    def post(self, request):
        user = request.user
        link_id = request.query_params.get("link_id")

        try:
            link = PatientDoctorLink.objects.get(Q(doctor=user, id=link_id))
            if link.status == 'accepted':
                serializer = DiagnosisSerializer(data=request.data)
                if serializer.is_valid():
                    serializer.save(link=link)
                    create_notification(user=link.patient, message=f"Доктор {link.doctor.full_name} поставил новый диагноз.")
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=400)
            else:
                return Response({"error": "link not accepted"}, status=403)

        except PatientDoctorLink.DoesNotExist:
            return Response({"error": "link not found"}, status=404)
        
    def patch(self, request):
        user = request.user
        diagnosis_id = request.query_params.get("diagnosis_id")

        try:
            diagnosis = Diagnosis.objects.get(id=diagnosis_id)
            if user == diagnosis.link.doctor:
                serializer = DiagnosisSerializer(diagnosis, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    create_notification(user=diagnosis.link.patient, message=f"Доктор {diagnosis.link.doctor.full_name} изменил ваш диагноз.")
                    return Response(serializer.data, status=200)
                return Response(serializer.errors, status=400)
            return Response({"error": "Not authorized to edit this diagnosis."}, status=403)
        except Diagnosis.DoesNotExist:
            return Response({'error': 'diagnosis not found'}, status=404)
    
    def delete(self, request):
        user = request.user
        diagnosis_id = request.query_params.get("diagnosis_id")

        try:
            diagnosis = Diagnosis.objects.get(id=diagnosis_id)
            if user == diagnosis.link.doctor:
                diagnosis.delete()                
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response({"error": "Not authorized to delete this diagnosis."}, status=403)
        except Diagnosis.DoesNotExist:
            return Response({'error': 'diagnosis not found'}, status=404)

class NotificationView(APIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(owner=request.user).order_by('-created_at')
        serializer = self.serializer_class(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        notification_id = request.data.get("notification_id")
        try:
            notification = Notification.objects.get(id=notification_id)
            if notification.owner != request.user:
                return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

            notification.is_read = True
            notification.save()
            return Response({"detail": "marked as read"}, status=200)
        except Notification.DoesNotExist:
            return Response({'error': 'notification not found'}, status=404)
    
    def delete(self, request):
        notification_id = request.data.get("notification_id")
        try:
            notification = Notification.objects.get(id=notification_id)
            if notification.owner != request.user:
                return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

            notification.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Notification.DoesNotExist:
            return Response({'error': 'notification not found'}, status=404)
        
class UnreadNotificationCountView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_cache_key(self, user):
        return f"user_{user.id}_unread_notification_count"
    
    def get(self, request):
        cache_key = self.get_cache_key(request.user)
        count = cache.get(cache_key)

        if count is None:
            count = self.calculate_unread_count(request.user)
            cache.set(cache_key, count)
        return Response({"unread_count": count})
    
    def calculate_unread_count(self, user):
        return Notification.objects.filter(owner=user, is_read=False).count()
