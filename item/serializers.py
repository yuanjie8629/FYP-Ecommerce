from rest_framework import serializers
from core.serializers import ChoiceField
from image.serializers import ImageSerializer
from item.choices import PROD_CAT
from item.models import Item, Package, PackageItem, Product


class ItemSerializer(serializers.ModelSerializer):
    image = ImageSerializer(many=True, required=False)
    thumbnail = serializers.ImageField()

    class Meta:
        model = Item
        exclude = [
            "polymorphic_ctype",
            "created_at",
            "last_update",
            "is_deleted",
        ]


class ProductSerializer(serializers.ModelSerializer):
    image = ImageSerializer(many=True, required=False)
    thumbnail = serializers.ImageField()
    category = ChoiceField(choices=PROD_CAT)

    class Meta:
        model = Product
        exclude = [
            "type",
            "polymorphic_ctype",
            "created_at",
            "last_update",
            "is_deleted",
        ]
        extra_kwargs = {
            "sku": {"validators": []},
        }


class ProductPrevSerializer(serializers.ModelSerializer):
    category = ChoiceField(choices=PROD_CAT)
    thumbnail = serializers.ImageField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "price",
            "sku",
            "status",
            "stock",
            "thumbnail",
            "category",
            "special_price",
        ]


class PackageItemSerializer(serializers.ModelSerializer):
    id = serializers.SlugRelatedField(slug_field="id", source="prod", read_only=True)
    name = serializers.SlugRelatedField(
        slug_field="name", source="prod", read_only=True
    )
    sku = serializers.SlugRelatedField(slug_field="sku", source="prod", read_only=True)
    price = serializers.SlugRelatedField(
        slug_field="price", source="prod", read_only=True
    )
    thumbnail = serializers.ImageField(source="prod.thumbnail")
    category = serializers.SlugRelatedField(
        slug_field="category",
        source="prod",
        read_only=True,
    )

    class Meta:
        model = PackageItem
        fields = ["quantity", "id", "name", "sku", "price", "thumbnail", "category"]


class PackageSerializer(serializers.ModelSerializer):
    thumbnail = serializers.ImageField()
    image = ImageSerializer(many=True, required=False)
    product = PackageItemSerializer(many=True, source="pack_item", read_only=True)
    avail_start_dt = serializers.DateField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y"
    )
    avail_end_dt = serializers.DateField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y", required=False
    )

    class Meta:
        model = Package
        exclude = [
            "type",
            "polymorphic_ctype",
            "created_at",
            "last_update",
            "is_deleted",
        ]
        extra_kwargs = {
            "sku": {"validators": []},
        }


class PackagePrevSerializer(serializers.ModelSerializer):
    product = PackageItemSerializer(many=True, source="pack_item")
    thumbnail = serializers.ImageField()

    class Meta:
        model = Package
        fields = [
            "id",
            "name",
            "price",
            "sku",
            "status",
            "stock",
            "thumbnail",
            "product",
        ]
