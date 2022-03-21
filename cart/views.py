from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from cart.models import Cart, CartItem
from cart.serializers import CartItemSerializer, CartSerializer
from core.utils import get_request_cust
from item.models import Item
from django.db.models import Prefetch
from rest_framework import permissions


class CartRetrieveView(generics.RetrieveAPIView):
    lookup_field = "cust__id"
    queryset = Cart.objects.all().prefetch_related(
        "cart_item", Prefetch("cust__cust_type")
    )
    serializer_class = CartSerializer


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
                return Response(data={"data": "removed due to no stock."},status=status.HTTP_200_OK)

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
