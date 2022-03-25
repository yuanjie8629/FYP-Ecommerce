from django.urls import include, path
from shipment.views import PickupListView

urlpatterns = [
    path("pickup_loc/", PickupListView.as_view(), name="pickupListView"),
]
