from django.urls import include, path
from voucher.views import VoucherCheckView

urlpatterns = [
    path("check/", VoucherCheckView, name="voucherRetrieveView"),
]
