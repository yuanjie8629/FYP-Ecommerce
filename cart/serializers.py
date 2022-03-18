from rest_framework import serializers

from cart.models import Cart, CartItem
from customer.models import CustAcc
from item.models import Item


class CartSerializer(serializers.ModelSerializer):
    cust = serializers.PrimaryKeyRelatedField(
        queryset=CustAcc.objects.all(), required=False
    )
    quantity = serializers.IntegerField()
    items = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Item.objects.all(), source="cart_item.item"
    )

    class Meta:
        model = Cart
        fields = "__all__"

    def create(self, validated_data):
        cust = validated_data.pop("cust", None)
        cart_item = validated_data.pop("cart_item", None)
        cart = Cart.objects.create(cust=cust)
        cart.items.set(cart_item)
        return cart
