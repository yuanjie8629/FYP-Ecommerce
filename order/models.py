import random
import string
from django.db import models
from core.models import SoftDeleteModel
from customer.models import Cust
from item.models import Item, Package
from order.choices import ORDER_STATUS
from shipment.models import OrderShipment
from voucher.models import Voucher
from django.db.models import Sum, F, Case, When
from reversion.models import Version


def create_id():
    return "".join(random.choices(string.digits, k=15))


def create_unique_id():
    id = create_id()
    unique = False
    while not unique:
        if not Order.objects.filter(pk=id).exists():
            print(id)
            return id
        else:
            id = create_id()


class Order(SoftDeleteModel):
    id = models.CharField(primary_key=True, max_length=40, default=create_unique_id)
    total_amt = models.DecimalField(max_digits=10, decimal_places=2, blank=True)
    status = models.CharField(max_length=20, choices=ORDER_STATUS, blank=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    cust = models.ForeignKey(
        Cust, on_delete=models.DO_NOTHING, blank=True, null=True, related_name="order"
    )
    voucher = models.ForeignKey(
        Voucher, on_delete=models.DO_NOTHING, blank=True, null=True
    )
    item = models.ManyToManyField(Item, through="OrderLine")
    shipment = models.ForeignKey(
        OrderShipment, on_delete=models.DO_NOTHING, related_name="order"
    )

    class Meta:
        db_table = "order"
        managed=False

    @property
    def get_subtotal_price(self):
        result = self.order_line.aggregate(
            total_price=Sum(
                Case(
                    When(
                        item__special_price__isnull=True,
                        then=(F("quantity") * F("item__price")),
                    ),
                    When(
                        item__special_price__isnull=False,
                        then=(F("quantity") * F("item__special_price")),
                    ),
                )
            )
        )
        return result.get("total_price")

    def save(self, *args, **kwargs):
        if self.status is None:
            self.status = "unpaid"
        super(Order, self).save(*args, **kwargs)
        return self


class OrderLine(models.Model):
    id = models.AutoField(primary_key=True)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    special_price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    cost_per_unit = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    weight = models.DecimalField(max_digits=8, decimal_places=2)
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name="order_line"
    )
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="order_line")

    class Meta:
        db_table = "order_line"
        managed=False

    @property
    def line_total(self):
        if self.special_price:
            return self.quantity * self.special_price
        return self.quantity * self.price
