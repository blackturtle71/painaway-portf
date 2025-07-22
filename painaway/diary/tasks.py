from celery import shared_task
from django.utils import timezone
from .models import PatientDoctorLink
from datetime import timedelta

@shared_task
def delete_rejected_links():
    """
    Task to delete PatientDoctorLink records that were rejected more than 24 hours ago
    """

    threshold = timezone.now() - timedelta(hours=24)
    rejected_links = PatientDoctorLink.objects.filter(status='rejected', created_at__lt = threshold)

    rejected_links.delete
    return f"Deleted rejected links"