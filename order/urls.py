from django.urls import include, path
from order.views import OrderView

urlpatterns = [
    path("", OrderView.as_view(), name="orderView"),
]
