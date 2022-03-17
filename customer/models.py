from django.db import models
from django.contrib.auth.models import AbstractUser

from customer.choices import GENDER_CHOICES

class CustAcc(AbstractUser):
    id = models.AutoField(primary_key=True)
    email = models.CharField(unique=True, max_length=255)
    password = models.CharField(max_length=255)
    status = models.CharField(max_length=20)
    cust_type = models.ForeignKey("CustType", on_delete=models.DO_NOTHING)
    pos_reg = models.ForeignKey(
        "CustPosReg", on_delete=models.DO_NOTHING, blank=True, null=True
    )

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = []
    
    class Meta:
        db_table = "cust_acc"



class CustPosDeclar(models.Model):
    id = models.AutoField(primary_key=True)
    answer = models.CharField(max_length=300)
    pos_reg = models.ForeignKey("CustPosReg", on_delete=models.CASCADE)
    pos_declar_ques = models.ForeignKey("CustPosDeclarQues", on_delete=models.CASCADE)

    class Meta:
        db_table = "cust_pos_declar"
        managed=False


class CustPosDeclarQues(models.Model):
    id = models.AutoField(primary_key=True)
    ques = models.CharField(max_length=300)

    class Meta:
        db_table = "cust_pos_declar_ques"
        managed=False


class CustPosReg(models.Model):
    id = models.AutoField(primary_key=True)
    ic_num = models.CharField(max_length=15)
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=255)
    phone_num = models.CharField(max_length=15)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    birthdate = models.DateField()
    address = models.CharField(max_length=255)
    position = models.CharField(max_length=30)
    marital_status = models.CharField(max_length=20)
    occupation = models.CharField(max_length=45, blank=True, null=True)
    comp_name = models.CharField(max_length=100, blank=True, null=True)
    reg_dt = models.DateTimeField()
    accept = models.IntegerField()
    # postal = models.ForeignKey(Postcode, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "cust_pos_reg"
        managed=False


class CustProfile(models.Model):
    cust = models.OneToOneField(CustAcc, models.DO_NOTHING, primary_key=True)
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=255)
    phone_num = models.CharField(max_length=15)
    gender = models.CharField(max_length=1, blank=True, null=True)
    birthdate = models.DateField(blank=True, null=True)

    class Meta:
        db_table = "cust_profile"


class CustType(models.Model):
    id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=20)

    class Meta:
        db_table = "cust_type"
        managed=False