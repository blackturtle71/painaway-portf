from django.db import models
from authentication.models import CustomUser
from django.core.validators import MinValueValidator, MaxValueValidator
    
class BodyPart(models.Model):
    name = models.CharField(max_length=50, unique=True)
    translation = models.CharField(max_length=50, unique=True, default='')

    def __str__(self):
        return self.name
    
class BodyStats(models.Model):
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='bodystats_owner')
    body_part = models.ForeignKey(BodyPart, on_delete=models.CASCADE, related_name='bodystats_bodypart')
    pain_type = models.CharField(max_length=10)
    intensity = models.IntegerField()
    description = models.TextField(blank=True, default="")
    tookPrescription = models.BooleanField(default=False)
    date_recorded = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "BodyStats"
        unique_together = ('owner', 'body_part', 'date_recorded')

    def __str__(self):
        return f"{self.body_part.name} - {self.pain_type} ({self.intensity}) for {self.owner}"
    
class PatientDoctorLink(models.Model):
    patient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='doc_links')
    doctor = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='patient_links')

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected')
    ]

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('patient', 'doctor')

    def __str__(self):
        return f"Link between patient {self.patient} and doctor {self.doctor} | [{self.status}]"
    
class Prescription(models.Model):
    link = models.OneToOneField(PatientDoctorLink, on_delete=models.CASCADE, related_name='prescription')
    prescription = models.CharField(max_length=50, null=False)
    details = models.TextField(blank=True)

    def __str__(self):
        return f"{self.prescription} for patient {self.link.patient} from doctor {self.link.doctor}"

class Diagnosis(models.Model):
    link = models.OneToOneField(PatientDoctorLink, on_delete=models.CASCADE, related_name='diagnosis')
    diagnosis = models.CharField(max_length=50, null=False)
    details = models.TextField(blank=True)

    def __str__(self):
        return f"Patient {self.link.patient} has {self.diagnosis}; diagnosed by doctor {self.link.doctor}"
    
class Notification(models.Model):
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.owner.username} --- {self.message[:30]}..."