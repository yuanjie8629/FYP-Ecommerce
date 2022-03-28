from django.db import models
from core.models import SoftDeleteModel
from customer.models import Cust
from item.models import Item
from django.db.models import Sum, F, Case, When


class Cart(SoftDeleteModel):
    id = models.AutoField(primary_key=True)
    cust = models.ForeignKey(Cust, on_delete=models.CASCADE, related_name="cart")
    items = models.ManyToManyField(Item, through="CartItem", related_name="cart")

    class Meta:
        db_table = "cart"
        managed = False

    @property
    def get_subtotal_price(self):
        result = self.cart_item.aggregate(
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

    @property
    def get_total_special_discount(self):
        result = self.cart_item.aggregate(
            total_discount=Sum(
                (F("quantity") * (F("item__price") - F("item__special_price"))),
            )
        )
        if result.get("total_discount"):
            return result.get("total_discount")
        else:
            return 0


class CartItem(models.Model):
    id = models.AutoField(primary_key=True)
    quantity = models.PositiveIntegerField()
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="cart_item")
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="cart_item")

    class Meta:
        db_table = "cart_item"
        managed = False
