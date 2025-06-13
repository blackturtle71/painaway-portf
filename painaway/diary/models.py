from django.db import models
from authentication.models import CustomUser
from django.core.validators import MinValueValidator, MaxValueValidator

class Note(models.Model):
    title = models.CharField(max_length=255)
    body = models.TextField()
    created_on = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notes_owner')

    def __str__(self):
        return self.title
    
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
    date_recorded = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "BodyStats"
        unique_together = ('owner', 'body_part', 'date_recorded')

    def __str__(self):
        return f"{self.body_part.name} - {self.pain_type} ({self.intensity}) for {self.owner}"
    