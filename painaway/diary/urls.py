from django.urls import path
from .views import BodyStatsView, BodyPartsView, SendDoctorRequestView, RespondToPatientRequestView, ListLinksView, PrescriptionView, DiagnosisView, NotificationView, UnreadNotificationCountView

urlpatterns = [
    path('bodyparts/', BodyPartsView.as_view(), name='body-parts-view'),
    path('stats/', BodyStatsView.as_view(), name='stats-view'),
    path('link_doc/', SendDoctorRequestView.as_view(), name='link-doc'),
    path('doc_respond/', RespondToPatientRequestView.as_view(), name='doc-respond'),
    path('list_links/', ListLinksView.as_view(), name='list-links'),
    path('prescription/', PrescriptionView.as_view(), name='prescription-view'),
    path('diagnosis/', DiagnosisView.as_view(), name='diagnosis-view'),
    path('notifications/', NotificationView.as_view(), name='notifications'),
    path('notifications/unread-count/', UnreadNotificationCountView.as_view(), name='unread-count'),
]