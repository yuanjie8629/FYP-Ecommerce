from rest_framework import generics
from voucher.models import Voucher
from voucher.serializers import VoucherSerializer

# Create your views here.
class VoucherRetrieveView(generics.RetrieveAPIView):
    queryset = (
        Voucher.objects.all().prefetch_related("cust_type").order_by("-last_update")
    )
    serializer_class = VoucherSerializer
    lookup_field = "code"
