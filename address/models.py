from django.db import models
from core.models import SoftDeleteModel
from customer.models import Cust


class State(models.Model):
    code = models.CharField(primary_key=True, max_length=3)
    name = models.CharField(max_length=45)

    class Meta:
        db_table = "state"
        managed = False


class Postcode(models.Model):
    id = models.AutoField(primary_key=True)
    postcode = models.CharField(max_length=5)
    city = models.CharField(max_length=50)
    state = models.ForeignKey(State, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "postcode"
        managed = False


class ShippingAddress(SoftDeleteModel):
    id = models.AutoField(primary_key=True)
    address = models.CharField(max_length=200)
    contact_name = models.CharField(max_length=100)
    contact_num = models.CharField(max_length=15)
    default = models.IntegerField(blank=True, null=True)
    postal = models.ForeignKey(Postcode, on_delete=models.DO_NOTHING)
    cust = models.ForeignKey(Cust, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "shipping_address"
        managed = False
