from rest_framework import generics, status
from rest_framework.response import Response
from order.models import Order
from order.serializers import OrderSerializer
from postcode.models import Postcode
from shipment.models import OrderShipment, Pickup, PickupLoc, Shipment


class OrderView(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

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
