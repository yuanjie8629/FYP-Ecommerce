from django.urls import include, path
from voucher.views import VoucherRetrieveView

urlpatterns = [
    path(
        "voucher/<str:code>", VoucherRetrieveView.as_view(), name="voucherRetrieveView"
    ),
]
