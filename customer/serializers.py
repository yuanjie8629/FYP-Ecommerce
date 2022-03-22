from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from postcode.models import Postcode
from .models import Cust, CustPosReg, CustType


class CustTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustType
        fields = "__all__"


class CustSerializer(serializers.ModelSerializer):
    type = serializers.SlugRelatedField(
        slug_field="type",
        read_only=True,
        source="cust_type",
    )
    birthdate = serializers.DateField(input_formats=["%d-%m-%Y"], format="%d-%m-%Y")

    class Meta:
        model = Cust
        fields = [
            "email",
            "name",
            "gender",
            "birthdate",
            "type",
        ]


class ChangePassSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    new_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Cust
        fields = (
            "password",
            "new_password",
        )

    def update(self, instance, validated_data):
        print("setting new password.")
        instance.set_password(validated_data.get("new_password"))
        instance.save()
        return instance


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True, validators=[UniqueValidator(queryset=Cust.objects.all())]
    )
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Cust
        fields = (
            "password",
            "password2",
            "email",
        )

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )

        return attrs

    def create(self, validated_data):
        user = Cust.objects.create(
            email=validated_data["email"], username=validated_data["email"]
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class CustPosRegSerializer(serializers.ModelSerializer):
    postcode = serializers.SlugRelatedField(
        slug_field="postcode", queryset=Postcode.objects.all()
    )
    position = serializers.SlugRelatedField(
        slug_field="type", queryset=CustType.objects.all()
    )
    birthdate = serializers.DateField(input_formats=["%d-%m-%Y"], format="%d-%m-%Y")

    class Meta:
        model = CustPosReg
        exclude = ["created_at", "last_update", "is_deleted", "accept"]
