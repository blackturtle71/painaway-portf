from django.urls import path
from .views import NotesView, BodyStatsView, BodyPartsView

urlpatterns = [
    path('notes/', NotesView.as_view(), name='notes-view'),
    path('bodyparts/', BodyPartsView.as_view(), name='body-parts-view'),
    path('stats/', BodyStatsView.as_view(), name='stats-view')
]