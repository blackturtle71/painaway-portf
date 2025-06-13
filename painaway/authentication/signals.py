
from django.db.models.signals import post_save, post_migrate
from django.dispatch import receiver
from django.contrib.auth.models import Group
from django.conf import settings

User = settings.AUTH_USER_MODEL  # Usually your CustomUser

from django.contrib.auth import get_user_model
UserModel = get_user_model()


@receiver(post_migrate)
def create_default_groups(sender, **kwargs):
    Group.objects.get_or_create(name='Doctor')
    Group.objects.get_or_create(name='Patient')


@receiver(post_save, sender=UserModel)
def add_user_to_patient_group(sender, instance, created, **kwargs):
    if created:
        patient_group, _ = Group.objects.get_or_create(name='Patient')
        instance.groups.add(patient_group)