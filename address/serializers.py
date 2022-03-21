from audioop import add
from rest_framework import serializers
from address.models import Address
from postcode.models import Postcode
from postcode.serializers import PostcodeSerializer


class AddressWriteSerializer(serializers.ModelSerializer):
    postcode = PostcodeSerializer(read_only=True)
    postcode = serializers.SlugRelatedField(
        slug_field="postcode", queryset=Postcode.objects.all()
    )

    class Meta:
        model = Address
        exclude = ["created_at", "last_update", "is_deleted"]

    def create(self, validated_data):
        addresses = Address.objects.filter(cust=validated_data.get("cust"))
        if not addresses:
            validated_data.data.update({"default": True})
        if addresses and validated_data.get("default") == True:
            for address in addresses:
                address.default = False
                address.save()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        addresses = Address.objects.filter(cust=validated_data.get("cust"))
        if not addresses:
            validated_data.data.update({"default": True})
        if addresses and validated_data.get("default") == True:
            for address in addresses:
                address.default = False
                address.save()
        return super().update(instance, validated_data)

class AddressSerializer(serializers.ModelSerializer):
    postcode = PostcodeSerializer(read_only=True)

    class Meta:
        model = Address
        exclude = ["created_at", "last_update", "is_deleted", "cust"]
