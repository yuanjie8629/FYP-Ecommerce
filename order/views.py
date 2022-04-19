from django.shortcuts import get_object_or_404
from rest_framework import mixins, viewsets, status
from rest_framework.response import Response
from rest_framework.exceptions import NotAuthenticated
from rest_framework.views import APIView
from order.filters import OrderFilter
from order.models import Order
from order.serializers import (
    OrderSerializer,
    OrderWithPickupSerializer,
    OrderWithShipmentSerializer,
    OrderWriteSerializer,
)
from reversion.models import Version
from voucher.models import Voucher


class OrderViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = (
        Order.objects.all()
        .select_for_update()
        .prefetch_related("item")
        .order_by("-created_at")
    )
    serializer_class = OrderSerializer
    filterset_class = OrderFilter

    def get_queryset(self):
        if self.action == "list":
            if hasattr(self.request.user, "cust"):
                return super().get_queryset().filter(cust=self.request.user)
            else:
                raise NotAuthenticated()

        return super().get_queryset()

    def get_serializer_class(self):
        if self.action == "create":
            return OrderWriteSerializer
        elif self.action == "list":
            return OrderSerializer
        else:
            return super().get_serializer_class()

    def retrieve(self, request, *args, **kwargs):
        order = self.get_object()
        print(order)
        shipment = order.shipment
        if shipment.type == "shipping":
            print("shipping")
            serializer = OrderWithShipmentSerializer(order)

        else:
            print("pickup")
            serializer = OrderWithPickupSerializer(order)

        response = Response(serializer.data)
        code = response.data.get("voucher", None)
        if code:
            voucher = Voucher.objects.filter(code=code).first()

            if voucher:
                voucher_version = (
                    Version.objects.get_for_object(voucher)
                    .filter(revision__date_created__lte=order.created_at)
                    .order_by("-revision__date_created")
                    .first()
                )
                subtotal = response.data.get("subtotal", None)
                if voucher_version:
                    code = voucher_version.field_dict["code"]
                    if voucher_version.field_dict["type"] == "percentage":
                        total_discount = float(subtotal) * float(
                            voucher_version.field_dict["discount"]
                        )
                    else:
                        total_discount = voucher_version.field_dict["discount"]

                else:
                    if voucher.type == "percentage":
                        total_discount = float(subtotal) * float(voucher.discount)
                    else:
                        total_discount = voucher.discount

                response.data.update({"voucher": code})
                response.data.update(
                    {"discount": "{:.2f}".format(float(total_discount))}
                )
        return response

    def create(self, request, *args, **kwargs):
        print(request.data)
        # address = request.data.get("address", None)
        # pickup = request.data.get("pickup", None)
        # if address:
        #     address.pop("id", None)
        #     address.pop("default", None)
        #     address.pop("state", None)
        #     address.pop("city", None)

        #     postcode = Postcode.objects.filter(
        #         postcode=address.pop("postcode", None)
        #     ).first()
        #     if not postcode:
        #         return Response(
        #             status=status.HTTP_404_NOT_FOUND,
        #             data={"detail": "invalid_postcode"},
        #         )
        #     shipment = Shipment.objects.create(**address, postcode=postcode)

        # elif pickup:
        #     pickup_loc = PickupLoc.objects.filter(location=pickup).first()
        #     shipment = Pickup.objects.create(pickup_loc=pickup_loc)
        # else:
        #     return Response(
        #         status=status.HTTP_404_NOT_FOUND,
        #         data={"detail": "no_shipment_found"},
        #     )

        # request.data.update({"shipment": shipment})

        if hasattr(request.user, "cust"):
            request.data.update({"cust": request.user.cust})
        return super().create(request, *args, **kwargs)


class OrderDetailsView(APIView):
    def post(self, request, format=None):
        email = request.data.get("email", None)
        order_id = request.data.get("order_id", None)
        get_object_or_404(Order, email=email, id=order_id)
        return Response(status=status.HTTP_200_OK)
