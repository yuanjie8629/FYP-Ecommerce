from django import views
from rest_framework import viewsets

from cart.models import Cart
from cart.serializers import CartSerializer


class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all().prefetch_related("item")
    serializer_class = CartSerializer
