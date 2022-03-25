from rest_framework import serializers
from customer.models import CustType
from customer.serializers import CustTypeSerializer
from voucher.models import Voucher


def check_code(value, *args, **kwargs):
    print(value)
    compare = kwargs.get("compare")
    check_query = Voucher.objects_with_deleted.filter(code=value)
    if check_query.exists():
        if not compare or compare != value:
            raise serializers.ValidationError(
                detail={
                    "error": {
                        "code": "invalid_code",
                        "message": "Voucher with this code already exists.",
                    }
                }
            )
    return value


class VoucherSerializer(serializers.ModelSerializer):
    cust_type = serializers.SlugRelatedField(
        many=True, slug_field="type", read_only=True
    )
    avail_start_dt = serializers.DateField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y"
    )
    avail_end_dt = serializers.DateField(
        input_formats=["%d-%m-%Y"], format="%d-%m-%Y", required=False
    )

    class Meta:
        model = Voucher
        exclude = [
            "is_deleted",
            "created_at",
            "last_update",
        ]
        extra_kwargs = {
            "code": {"validators": []},
        }