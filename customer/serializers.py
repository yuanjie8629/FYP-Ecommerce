from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from customer.models import Cust, CustType


class CustTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustType
        fields = "__all__"


class CustSerializer(serializers.ModelSerializer):
    type = serializers.SlugRelatedField(
        slug_field="type", source="cust_type", read_only=True
    )

    class Meta:
        model = Cust
        fields = ["email", "name", "phone_num", "gender", "birthdate", "type"]




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
