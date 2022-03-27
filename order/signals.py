from django.dispatch import receiver
from django.db.models.signals import pre_save
from order.models import OrderLine
from rest_framework import serializers
from django.utils.translation import gettext as _


@receiver(pre_save, sender=OrderLine)
def deduct_product_quantity(sender, instance, **kwargs):
    item = instance.item
    if item.stock <= 0:
        raise serializers.ValidationError({"detail": "no_stock"})
    item.stock = item.stock - 1
    item.save()
