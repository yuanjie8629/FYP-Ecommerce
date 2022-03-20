from rest_framework import serializers
from django.shortcuts import get_object_or_404
from cart.models import Cart, CartItem
from customer.models import Cust
from item.models import Item

# class CartItemSerializer(serializers.ModelSerializer):
#     cart = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
#     item = ItemSerializer()

#     class Meta:
#         model = Cart
#         fields = "__all__"


class CartItemSerializer(serializers.ModelSerializer):

    id = serializers.SlugRelatedField(slug_field="id", source="item", read_only=True)
    name = serializers.SlugRelatedField(
        slug_field="name", source="item", read_only=True
    )
    sku = serializers.SlugRelatedField(slug_field="sku", source="item", read_only=True)
    price = serializers.DecimalField(
        source="item.price", read_only=True, decimal_places=2, max_digits=10
    )
    special_price = serializers.DecimalField(
        source="item.special_price", read_only=True, decimal_places=2, max_digits=10
    )
    thumbnail = serializers.ImageField(source="item.thumbnail", read_only=True)
    stock = serializers.SlugRelatedField(
        slug_field="stock", source="item", read_only=True
    )
    quantity = serializers.IntegerField()
    item = serializers.PrimaryKeyRelatedField(
        queryset=Item.objects.all(), write_only=True
    )
    cust = serializers.PrimaryKeyRelatedField(
        queryset=Cust.objects.all(), write_only=True
    )

    class Meta:
        model = CartItem
        fields = [
            "id",
            "name",
            "sku",
            "price",
            "special_price",
            "thumbnail",
            "stock",
            "quantity",
            "item",
            "cust",
        ]


class CartSerializer(serializers.ModelSerializer):
    cust = serializers.SlugRelatedField(
        slug_field="email", queryset=Cust.objects.all(), required=False
    )
    items = CartItemSerializer(many=True, source="cart_item")
    total_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = Cart
        exclude = ["created_at", "last_update", "is_deleted"]
