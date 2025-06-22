from django.urls import path
from .views import BodyStatsView, BodyPartsView, SendDoctorRequestView, RespondToPatientRequestView

urlpatterns = [
    path('bodyparts/', BodyPartsView.as_view(), name='body-parts-view'),
    path('stats/', BodyStatsView.as_view(), name='stats-view'),
    path('link_doc/', SendDoctorRequestView.as_view(), name='link-doc'),
    path('doc_respond/', RespondToPatientRequestView.as_view(), name='doc-respond')
]