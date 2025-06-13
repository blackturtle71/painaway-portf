from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import validate_email

class CustomUser(AbstractUser):
    # TODO: add aditional fields if need be
    phone_number = models.CharField(max_length=15, blank=True)
    email = models.EmailField(
        'email address',
        unique=True,
        blank=False,
        null=False,
        validators=[validate_email]
    )

    def __str__(self):
        return self.username
