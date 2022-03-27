from django.urls import include, path
from voucher.views import VoucherCheckAutoApplyView, VoucherCheckView

urlpatterns = [
    path("check/", VoucherCheckView, name="voucherRetrieveView"),
    path("check/auto/", VoucherCheckAutoApplyView, name="voucherCheckAutoApplyView"),
]
