from unittest import result
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from cart.models import Cart, CartItem
from cart.serializers import CartItemSerializer, CartSerializer
from core.utils import get_request_cust
from item.models import Item
from django.db.models import Prefetch, Sum, F
from rest_framework import permissions
from item.serializers import ItemSerializer
from shipment.models import ShippingFee
from shipment.serializers import ShippingFeeSerializer


def calculate_ship_fee(total_weight, state):
    shipping_fee = ShippingFee.objects.filter(
        location__name=state,
        weight_start__lte=total_weight,
        weight_end__gte=total_weight,
    ).first()

    if not shipping_fee:
        weight_most_end = (
            ShippingFee.objects.filter(location__name=state)
            .order_by("-weight_end")
            .first()
        )
        sub_fee = weight_most_end.sub_fee
        sub_weight = weight_most_end.sub_weight
        ship_fee = weight_most_end.ship_fee
        weight_end = weight_most_end.weight_end
        remain_weight = total_weight - weight_end
        shipping_fee = ship_fee + (remain_weight / sub_weight * sub_fee)
        return shipping_fee

    serializer = ShippingFeeSerializer(shipping_fee)
    return serializer.data.get("ship_fee")


class CartRetrieveView(generics.RetrieveAPIView):
    lookup_field = "cust__id"
    queryset = Cart.objects.all().prefetch_related(
        "cart_item", Prefetch("cust__cust_type")
    )

    serializer_class = CartSerializer

    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        shipping_fee = 0
        discount = 0
        if request.query_params.get("state"):
            state = request.query_params.get("state")
            result = Cart.objects.aggregate(
                total_weight=Sum(F("cart_item__quantity") * F("items__weight"))
            )
            total_weight = result.get("total_weight")
            shipping_fee = calculate_ship_fee(total_weight, state)
            response.data.update({"ship_fee": shipping_fee})

        subtotal_price = response.data.get("subtotal_price")
        if subtotal_price and shipping_fee and discount:
            total_price = float(subtotal_price) + float(shipping_fee) - float(discount)
            response.data.update({"total_price": total_price})
        return response


class CartAddItemView(generics.CreateAPIView):
    lookup_field = "cust__id"
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        print(get_request_cust(request) == request.user.cust)
        if get_request_cust(request) == request.user.cust:
            item = get_object_or_404(Item, pk=request.data.get("item"))

            quantity = request.data.get("quantity")
            if quantity is None:
                return Response(
                    data={"error": "no_quantity"}, status=status.HTTP_400_BAD_REQUEST
                )

            cart = Cart.objects.filter(cust=request.user.cust).first()

            if cart is None:
                cart = Cart.objects.create(cust=request.user.cust)

            existing_item = CartItem.objects.filter(cart=cart, item=item).first()

            if existing_item:
                if (
                    item.stock <= 0
                    or item.stock - (existing_item.quantity + quantity) < 0
                ):
                    return Response(
                        data={"error": "no_stock"},
                        status=status.HTTP_406_NOT_ACCEPTABLE,
                    )

                existing_item.quantity += quantity
                existing_item.save()
            else:
                cart_item = CartItem(cart=cart, item=item, quantity=quantity)
                cart_item.save()

            cart.save()
            cart.refresh_from_db()
            serializer = CartSerializer(cart)
            return Response(data=serializer.data, status=status.HTTP_200_OK)

        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class CartRemoveItemView(generics.CreateAPIView):
    lookup_field = "cust__id"
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if get_request_cust(request) == request.user.cust:
            item = get_object_or_404(Item, pk=request.data.get("item"))

            quantity = request.data.get("quantity")
            if quantity is None:
                return Response(
                    data={"error": "no_quantity"}, status=status.HTTP_400_BAD_REQUEST
                )

            cart = Cart.objects.filter(cust=request.user.cust).first()
            existing_item = get_object_or_404(
                CartItem.objects.filter(cart=cart, item=item)
            )
            if item.stock <= 0 or item.stock - quantity < 0:
                print("remove")
                print(existing_item.item.name)
                existing_item.delete()
                cartItem = CartItem.objects.filter(cart=cart)
                print(cartItem)
                serializer = CartItemSerializer(cartItem, many=True)

                return Response(
                    data={"items": serializer.data}, status=status.HTTP_200_OK
                )

            if cart is None:
                cart = Cart.objects.create(cust=request.user.cust)

            if existing_item.quantity > 1:
                existing_item.quantity -= quantity
                existing_item.save()
            else:
                existing_item.delete()
            cart.save()
            cart.refresh_from_db()
            serializer = CartSerializer(cart)

            return Response(data=serializer.data, status=status.HTTP_200_OK)

        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class CartSetItemView(generics.CreateAPIView):
    lookup_field = "cust__id"
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if get_request_cust(request) == request.user.cust:
            item = get_object_or_404(Item, pk=request.data.get("item"))

            quantity = request.data.get("quantity")
            if quantity is None:
                return Response(
                    data={"error": "no_quantity"}, status=status.HTTP_400_BAD_REQUEST
                )

            if item.stock <= 0 or item.stock < quantity:
                return Response(
                    data={"error": "no_stock"}, status=status.HTTP_406_NOT_ACCEPTABLE
                )

            cart = Cart.objects.filter(cust=request.user.cust).first()

            if cart is None:
                cart = Cart.objects.create(cust=request.user.cust)

            existing_item = get_object_or_404(
                CartItem.objects.filter(cart=cart, item=item)
            )

            if quantity <= 0:
                existing_item.delete()
            else:
                existing_item.quantity = quantity
                existing_item.save()

            cart.save()
            cart.refresh_from_db()
            serializer = CartSerializer(cart)

            return Response(data=serializer.data, status=status.HTTP_200_OK)

        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


@api_view(["POST"])
def CartDetailsView(request):

    state = request.data.get("state", None)

    if "list" in request.data:
        data_list = request.data.get("list")
    else:
        response = Response(status=status.HTTP_404_NOT_FOUND)
        response.data = {
            "detail": "Please make sure to put the data with a 'list' key as {list: [data]}"
        }
        return response

    ids = []
    for data in data_list:
        if "id" in data:
            ids.append(data.get("id"))
        else:
            response = Response(status=status.HTTP_404_NOT_FOUND)
            response.data = {
                "detail": "Please provide the item id as 'id' for each data."
            }
            return response

        if not "quantity" in data:
            response = Response(status=status.HTTP_404_NOT_FOUND)
            response.data = {"detail": "Please provide the quantity for each data."}
            return response

    item_list = list(Item.objects.select_related().filter(id__in=ids))
    print(item_list)
    new_list = []
    subtotal_price = 0
    total_weight = 0
    for item in item_list:
        for data in data_list:
            if item.id == data.get("id"):
                serializer = ItemSerializer(item)

                quantity = (
                    data.get("quantity")
                    if data.get("quantity") <= item.stock or item.stock == 0
                    else item.stock
                )
                if item.special_price:
                    price = item.special_price * quantity
                else:
                    price = item.price * quantity
                subtotal_price += price

                new_list.append({**serializer.data, "quantity": quantity})

                if state:
                    total_weight += item.weight * quantity
                continue

    data = {"items": new_list, "subtotal_price": "{:.2f}".format(subtotal_price)}
    shipping_fee = 0
    discount = 0

    if state:
        shipping_fee = calculate_ship_fee(total_weight, state)
        data.update({"ship_fee": shipping_fee})

    total_price = float(subtotal_price) + float(shipping_fee) - float(discount)
    data.update({"total_price": total_price})
    return Response(
        status=status.HTTP_200_OK,
        data=data,
    )
