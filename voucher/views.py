from datetime import date
import re
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from voucher.models import Voucher
from voucher.serializers import VoucherSerializer
from order.models import Order

# Create your views here.
@api_view(["POST"])
def VoucherCheckView(request):
    code = request.data.get("code", None)
    instance = (
        Voucher.objects.all()
        .filter(
            code=code,
            status="active",
            avail_start_dt__lte=date.today(),
            avail_end_dt__gte=date.today(),
        )
        .prefetch_related("cust_type")
        .first()
    )
    serializer = VoucherSerializer(instance)
    voucher = serializer.data

    if not hasattr(request.user, "cust"):
        return Response(
            status=status.HTTP_404_NOT_FOUND, data={"detail": "require_login"}
        )

    if not request.user.cust.cust_type.type in voucher.get("cust_type"):
        print("invalid cust_type")
        return Response(status=status.HTTP_404_NOT_FOUND, data={"detail": "invalid"})

    if voucher.get("total_amt", None) == 0:
        print("fully redeemed")
        return Response(status=status.HTTP_404_NOT_FOUND, data={"detail": "no_stock"})

    orders = Order.objects.filter(cust=request.user, voucher=instance)
    print(orders.count())
    print(voucher.get("usage_limit"))

    if orders.count() > voucher.get("usage_limit") and voucher.get("usage_limit") != -1:
        return Response(
            status=status.HTTP_404_NOT_FOUND, data={"detail": "exceed_limit"}
        )

    if voucher.get("min_spend", None) is not None and not request.data.get(
        "subtotal_price", None
    ):
        return Response(
            status=status.HTTP_404_NOT_FOUND,
            data={"detail": "require_subtotal_price"},
        )

    subtotal_price = request.data.get("subtotal_price")

    min_spend = voucher.get("min_spend", None)
    if min_spend and float(subtotal_price) < float(min_spend):
        return Response(
            status=status.HTTP_404_NOT_FOUND,
            data={"min_spend": min_spend},
        )

    return Response(status=status.HTTP_200_OK, data={"detail": "valid_voucher"})


@api_view(["GET"])
def VoucherCheckAutoApplyView(request):
    if not hasattr(request.user, "cust"):
        return Response(
            status=status.HTTP_404_NOT_FOUND, data={"detail": "require_login"}
        )

    print(request.user.cust.cust_type)
    auto_voucher = (
        Voucher.objects.all()
        .filter(
            status="active",
            avail_start_dt__lte=date.today(),
            avail_end_dt__gte=date.today(),
            auto_apply=True,
            cust_type=request.user.cust.cust_type,
        )
        .order_by("created_at")
        .prefetch_related("cust_type")
        .first()
    )
    print(auto_voucher)

    if auto_voucher:
        return Response(status=status.HTTP_200_OK, data={"code": auto_voucher.code})
    return Response(status=status.HTTP_404_NOT_FOUND, data={"detail": "Not found."})
