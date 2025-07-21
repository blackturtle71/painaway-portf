from .models import Notification

def create_notification(user, message):
    notification = Notification.objects.create(
        owner=user,
        message=message,
    )

    return notification