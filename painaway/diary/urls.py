from django.urls import path
from .views import NotesView, BodyStatsView, BodyPartsView, SendDoctorRequestView, RespondToPatientRequestView

urlpatterns = [
    path('notes/', NotesView.as_view(), name='notes-view'),
    path('bodyparts/', BodyPartsView.as_view(), name='body-parts-view'),
    path('stats/', BodyStatsView.as_view(), name='stats-view'),
    path('link_doc/', SendDoctorRequestView.as_view(), name='link-doc'),
    path('doc_respond/', RespondToPatientRequestView.as_view(), name='doc-respond')
]