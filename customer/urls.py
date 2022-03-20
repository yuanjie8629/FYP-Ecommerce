from django.urls import include, path

from .views import CustDetails

urlpatterns = [
    path("<int:pk>/", CustDetails.as_view()),
]
