from django.forms import ModelForm
from order.models import OrderLine


class OrderLineForm(ModelForm):
    class Meta:
        model = OrderLine
        fields = "__all__"
