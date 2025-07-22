from django.core.cache import cache
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Notification

@receiver(post_save, sender=Notification)
@receiver(post_delete, sender=Notification)
def invalidate_notification_cache(sender, instance, **kwargs):
    """Invalidate cache when notifications change"""
    cache.delete(f"user_{instance.owner.id}_unread_notification_count")
    