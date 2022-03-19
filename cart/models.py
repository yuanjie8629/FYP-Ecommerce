from django.db import models
from core.models import SoftDeleteModel
from customer.models import CustAcc

from item.models import Item


class Cart(SoftDeleteModel):
    id = models.AutoField(primary_key=True)
    cust = models.ForeignKey(CustAcc, on_delete=models.CASCADE, related_name='cart')
    items = models.ManyToManyField(Item, through="CartItem", related_name='cart')

    class Meta:
        db_table = "cart"
        managed = False
    
    


class CartItem(models.Model):
    id = models.AutoField(primary_key=True)
    quantity = models.PositiveIntegerField()
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="cart_item")
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="cart_item")

    class Meta:
        db_table = "cart_item"
        managed = False
    