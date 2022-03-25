from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from item.models import Item
from item.serializers import ItemSerializer
from shipment.models import PickupLoc, ShippingFee
from shipment.serializers import PickupLocSerializer


class PickupListView(generics.ListAPIView):
    queryset = PickupLoc.objects.all()
    serializer_class = PickupLocSerializer
    pagination_class = None


# @api_view(["POST"])
# def calculateShippingFeeByItemView(request):
#     if "items" in request.data and "state" in request.data:
#         data_list = request.data.get("items")
#         state = request.data.get("state")
#     else:
#         response = Response(status=status.HTTP_404_NOT_FOUND)
#         response.data = {
#             "detail": "Please make sure to put the data as {state: state, items: [{id,quantity},...]}"
#         }
#         return response

#     ids = []
#     for data in data_list:
#         if "id" in data:
#             ids.append(data.get("id"))
#         else:
#             response = Response(status=status.HTTP_404_NOT_FOUND)
#             response.data = {
#                 "detail": "Please provide the item id as 'id' for each data."
#             }
#             return response

#         if not "quantity" in data:
#             response = Response(status=status.HTTP_404_NOT_FOUND)
#             response.data = {"detail": "Please provide the quantity for each data."}
#             return response

#     item_list = list(Item.objects.select_related().filter(id__in=ids))
#     total_weight = 0
#     for item in item_list:
#         for data in data_list:
#             if item.id == data.get("id"):
#                 total_weight += item.weight * data.get("quantity")

#     shipping_fee = ShippingFee.objects.filter(
#         state__name=state, weight_start__gte=total_weight, weight_end__lte=total_weight
#     )
#     print(shipping_fee)

#     return Response(status=status.HTTP_200_OK, data={"ship_fee": shipping_fee})
