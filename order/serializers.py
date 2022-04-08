from datetime import date
from rest_framework import serializers
from cart.models import Cart
from customer.models import Cust
from item.models import Item, PackageItem, Product
from order.models import Order, OrderLine
from postcode.models import Postcode
from shipment.models import Pickup, Shipment
from shipment.serializers import PickupSerializer, ShipmentSerializer
from shipment.utils import calculate_ship_fee
from voucher.models import Voucher
from django.db.models import Prefetch, Sum, F
from voucher.utils import calculate_discount


class OrderLineSerializer(serializers.ModelSerializer):
    id = serializers.SlugRelatedField(slug_field="id", source="item", read_only=True)
    name = serializers.SlugRelatedField(
        slug_field="name", source="item", read_only=True
    )
    sku = serializers.SlugRelatedField(slug_field="sku", source="item", read_only=True)
    price = serializers.DecimalField(decimal_places=2, max_digits=10, read_only=True)
    special_price = serializers.DecimalField(
        decimal_places=2, max_digits=10, read_only=True
    )
    thumbnail = serializers.ImageField(source="item.thumbnail", read_only=True)
    weight = serializers.DecimalField(decimal_places=2, max_digits=10, read_only=True)
    quantity = serializers.IntegerField()
    item = serializers.PrimaryKeyRelatedField(
        queryset=Item.objects.all(), write_only=True
    )
    cust = serializers.PrimaryKeyRelatedField(
        queryset=Cust.objects.all(), required=False
    )

    class Meta:
        model = OrderLine
        fields = [
            "id",
            "name",
            "sku",
            "price",
            "special_price",
            "thumbnail",
            "weight",
            "quantity",
            "item",
            "cust",
        ]


class OrderAddressSerializer(serializers.Serializer):
    address = serializers.CharField(max_length=200)
    contact_name = serializers.CharField(max_length=100)
    contact_num = serializers.CharField(max_length=15)
    postcode = serializers.SlugRelatedField(
        slug_field="postcode", queryset=Postcode.objects.all()
    )


class OrderWriteSerializer(serializers.ModelSerializer):
    id = serializers.CharField(required=False)
    voucher = serializers.SlugRelatedField(
        slug_field="code",
        queryset=Voucher.objects.all().filter(
            status="active",
            avail_start_dt__lte=date.today(),
            avail_end_dt__gte=date.today(),
        ),
        required=False,
    )
    item = OrderLineSerializer(many=True, source="order_line")
    address = OrderAddressSerializer(required=False)
    pickup = PickupSerializer(required=False)

    class Meta:
        model = Order
        exclude = ["created_at", "last_update", "is_deleted", "shipment"]

    def create(self, validated_data):
        cust = validated_data.get("cust", None)
        email = validated_data.get("email", None)
        voucher = validated_data.get("voucher", None)
        address = validated_data.get("address", None)
        pickup = validated_data.get("pickup", None)

        if address:
            postcode = address.get("postcode")

        shipping_fee = 0
        discount = 0

        if cust:
            cart = (
                Cart.objects.filter(cust=cust)
                .prefetch_related("cart_item", Prefetch("cust__cust_type"))
                .annotate(
                    total_weight=Sum(F("cart_item__quantity") * F("items__weight"))
                )
                .first()
            )
            subtotal = float(cart.get_subtotal_price)
            order_line = cart.cart_item.all()
            if voucher:
                discount = float(calculate_discount(subtotal, voucher, cust))

            if address:
                shipping_fee = float(
                    calculate_ship_fee(cart.total_weight, postcode.state.name)
                )
                shipment = Shipment.objects.create(**address, ship_fee=shipping_fee)
                total_amt = subtotal + shipping_fee - discount
            else:
                shipment = Pickup.objects.create(**pickup)
                total_amt = subtotal - discount

            order = Order.objects.create(
                cust=cust,
                voucher=voucher,
                shipment=shipment,
                total_amt=total_amt,
                email=cust.email,
                status="unpaid",
            )

            for ol in order_line:
                cost_per_unit = 0
                if Product.objects.filter(pk=ol.item.id).exists():
                    cost_per_unit = ol.item.product.cost_per_unit
                else:
                    cost_per_unit = (
                        PackageItem.objects.filter(pack=ol.item.package)
                        .aggregate(
                            cost_per_unit=Sum(F("quantity") * F("prod__cost_per_unit"))
                        )
                        .get("cost_per_unit")
                    )

                order_item = OrderLine(
                    order=order,
                    item=ol.item,
                    price=ol.item.price,
                    special_price=ol.item.special_price,
                    cost_per_unit=cost_per_unit,
                    weight=ol.item.weight,
                    quantity=ol.quantity,
                )
                self.deduct_product_quantity(order_item)
                order_item.save()
            cart.delete()
            return order

        else:
            order_line = validated_data.get("order_line")
            total_weight = 0
            subtotal = 0
            for ol in order_line:
                item = ol.get("item")
                quantity = ol.get("quantity")
                total_weight += item.weight * quantity
                if item.special_price:
                    price = item.special_price * quantity
                else:
                    price = item.price * quantity
                subtotal += price

            if address:
                shipping_fee = float(
                    calculate_ship_fee(total_weight, postcode.state.name)
                )
                shipment = Shipment.objects.create(**address, ship_fee=shipping_fee)
                total_amt = float(subtotal) + shipping_fee

            else:
                shipment = Pickup.objects.create(**pickup)
                total_amt = float(subtotal)

            order = Order.objects.create(
                shipment=shipment,
                total_amt=total_amt,
                email=email,
                status="unpaid",
            )

            print(order_line)
            for ol in order_line:
                print(ol)
                item = ol.get("item")
                quantity = ol.get("quantity")

                cost_per_unit = 0

                if isinstance(item.product, Product):
                    cost_per_unit = item.product.cost_per_unit
                else:
                    cost_per_unit = (
                        PackageItem.objects.filter(pack=item)
                        .aggregate(
                            cost_per_unit=Sum(F("quantity") * F("prod__cost_per_unit"))
                        )
                        .get("cost_per_unit")
                    )

                order_item = OrderLine(
                    order=order,
                    item=item,
                    price=item.price,
                    cost_per_unit=cost_per_unit,
                    special_price=item.special_price,
                    weight=item.weight,
                    quantity=quantity,
                )
                self.deduct_product_quantity(order_item)
                order_item.save()

            return order

    def deduct_product_quantity(self, instance):
        item = instance.item
        if item.stock <= 0 or instance.quantity > item.stock:
            raise serializers.ValidationError({"detail": "no_stock"})
        item.stock = item.stock - instance.quantity
        item.save()


class OrderSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y", source="created_at"
    )
    shipment = serializers.SlugRelatedField(slug_field="type", read_only=True)

    class Meta:
        model = Order
        exclude = [
            "created_at",
            "last_update",
            "is_deleted",
            "item",
            "voucher",
            "cust",
        ]


class OrderWithShipmentSerializer(serializers.ModelSerializer):
    voucher = serializers.SlugRelatedField(
        slug_field="code",
        read_only=True,
        required=False,
    )
    item = OrderLineSerializer(many=True, source="order_line")
    shipment = ShipmentSerializer(source="shipment.shipment")
    subtotal = serializers.DecimalField(
        max_digits=10, decimal_places=2, source="get_subtotal_price"
    )
    date = serializers.DateTimeField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y", source="created_at"
    )

    class Meta:
        model = Order
        exclude = ["created_at", "last_update", "is_deleted"]


class OrderWithPickupSerializer(serializers.ModelSerializer):
    voucher = serializers.SlugRelatedField(
        slug_field="code",
        read_only=True,
        required=False,
    )
    item = OrderLineSerializer(many=True, source="order_line")
    pickup = PickupSerializer(source="shipment.pickup")
    subtotal = serializers.DecimalField(
        max_digits=10, decimal_places=2, source="get_subtotal_price"
    )
    date = serializers.DateTimeField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y", source="created_at"
    )

    class Meta:
        model = Order
        exclude = ["created_at", "last_update", "is_deleted", "shipment"]
