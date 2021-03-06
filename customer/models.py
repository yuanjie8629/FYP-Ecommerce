from django.db import models
from core.choices import GENDER_CHOICES
from core.models import SoftDeleteModel, Users
from customer.choices import MARITAL_STATUS
from postcode.models import Postcode


class CustType(models.Model):
    id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=20)

    class Meta:
        db_table = "cust_type"
        managed = False


class Cust(Users):
    cust_type = models.ForeignKey(
        "CustType",
        on_delete=models.DO_NOTHING,
        related_name="cust",
        default=CustType.objects.get(type="cust"),
    )
    pos_reg = models.ForeignKey(
        "CustPosReg", on_delete=models.DO_NOTHING, blank=True, null=True
    )

    class Meta:
        db_table = "cust"
        managed = False


class CustPosReg(SoftDeleteModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    marital_status = models.CharField(max_length=20, choices=MARITAL_STATUS)
    email = models.CharField(max_length=255)
    phone_num = models.CharField(max_length=15)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    birthdate = models.DateField()
    address = models.CharField(max_length=255)
    postcode = models.ForeignKey(Postcode, on_delete=models.DO_NOTHING)
    position = models.ForeignKey("CustType", on_delete=models.DO_NOTHING)
    occupation = models.CharField(max_length=45)
    comp_name = models.CharField(max_length=100, blank=True, null=True)
    accept = models.BooleanField(blank=True, null=True)

    class Meta:
        db_table = "cust_pos_reg"
        managed = False
