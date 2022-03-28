from rest_framework import serializers
from postcode.models import State
from shipment.models import Pickup, PickupLoc, ShippingFee


class ShippingFeeSerializer(serializers.ModelSerializer):
    location = serializers.SlugRelatedField(
        slug_field="name", queryset=State.objects.all()
    )

    def create(self, validated_data):
        return super().create(validated_data)

    class Meta:
        model = ShippingFee
        exclude = ["created_at", "is_deleted"]


class PickupLocSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupLoc
        fields = ["id", "location"]


class PickupSerializer(serializers.ModelSerializer):
    location = serializers.SlugRelatedField(
        slug_field="location", queryset=PickupLoc.objects.all(), source="pickup_loc"
    )

    class Meta:
        model = Pickup
        exclude = ["type", "is_deleted", "pickup_loc"]
