from django_filters import rest_framework as filters
from order.models import Order


class OrderFilter(filters.FilterSet):
    id = filters.CharFilter(field_name="id", lookup_expr="icontains")

    class Meta:
        model = Order
        fields = ["id"]
