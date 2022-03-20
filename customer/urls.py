from django.urls import include, path

from .views import ChangePassView, CustDetails

urlpatterns = [
    path("<int:pk>/", CustDetails.as_view()),
    path("<int:pk>/change_pass/", ChangePassView.as_view()),
]
