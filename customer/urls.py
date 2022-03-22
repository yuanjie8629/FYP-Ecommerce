from django.urls import include, path

from .views import ChangePassView, CustDetails, CustPosRegView

urlpatterns = [
    path("<int:pk>/", CustDetails.as_view(), name="cust_details"),
    path("<int:pk>/change_pass/", ChangePassView.as_view(), name="change-pass"),
    path("position/registration/", CustPosRegView.as_view(), name="change-pass"),
]
