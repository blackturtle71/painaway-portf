from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import validate_email, MinValueValidator, MaxValueValidator
from django.utils import timezone

class CustomUser(AbstractUser):
    # TODO: add aditional fields if need be
    class Sex(models.TextChoices):
        MALE = "M", "Male"
        FEMALE = "F", "FEMALE"

    phone_number = models.CharField(max_length=15, blank=False,null=False, unique=True)
    email = models.EmailField(
        'email address',
        unique=True,
        blank=False,
        null=False,
        validators=[validate_email]
    )
    father_name = models.CharField(max_length=20, blank=True)
    sex = models.CharField(max_length=4, choices=Sex.choices, blank=True, null=True, verbose_name='Sex')

    date_of_birth = models.DateField(
        blank=True,
        null=True,
        validators=[
            MinValueValidator(timezone.datetime(1900, 1, 1).date()),
            MaxValueValidator(timezone.datetime.today().date())
        ],
        verbose_name='Date of Birth')


    def __str__(self):
        return self.username
