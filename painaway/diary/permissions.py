from rest_framework import permissions
from .models import PatientDoctorLink

class IsPatientOrLinkedDoc(permissions.BasePermission):
    def has_permission(self, request, view, obj):
        if obj.patient == request.user:
            return True
        return PatientDoctorLink.objects.filter(
            doctor=request.user,
            patient=obj.patientm,
            status='accepted'
        ).exists()

class IsDoctor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Doctor').exists()