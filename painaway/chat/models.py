from django.db import models
from authentication.models import CustomUser
from django.core.exceptions import ValidationError

class Message(models.Model):
    sender = models.ForeignKey(CustomUser, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(CustomUser, related_name='received_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']  # Ensure messages are ordered by timestamp

    def __str__(self):
        return f"Message from {self.sender} to {self.receiver} at {self.timestamp} - {self.content}"