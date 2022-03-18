# Generated by Django 4.0.2 on 2022-03-18 12:49

from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="CustPosDeclar",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("answer", models.CharField(max_length=300)),
            ],
            options={
                "db_table": "cust_pos_declar",
            },
        ),
        migrations.CreateModel(
            name="CustPosDeclarQues",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("ques", models.CharField(max_length=300)),
            ],
            options={
                "db_table": "cust_pos_declar_ques",
            },
        ),
        migrations.CreateModel(
            name="CustPosReg",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("ic_num", models.CharField(max_length=15)),
                ("name", models.CharField(max_length=100)),
                ("email", models.CharField(max_length=255)),
                ("phone_num", models.CharField(max_length=15)),
                (
                    "gender",
                    models.CharField(
                        choices=[("M", "Male"), ("F", "Female")], max_length=1
                    ),
                ),
                ("birthdate", models.DateField()),
                ("address", models.CharField(max_length=255)),
                ("position", models.CharField(max_length=30)),
                ("marital_status", models.CharField(max_length=20)),
                ("occupation", models.CharField(blank=True, max_length=45, null=True)),
                ("comp_name", models.CharField(blank=True, max_length=100, null=True)),
                ("reg_dt", models.DateTimeField()),
                ("accept", models.IntegerField()),
            ],
            options={
                "db_table": "cust_pos_reg",
            },
        ),
        migrations.CreateModel(
            name="CustType",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("type", models.CharField(max_length=20)),
            ],
            options={
                "db_table": "cust_type",
            },
        ),
        migrations.CreateModel(
            name="CustAcc",
            fields=[
                (
                    "last_login",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="last login"
                    ),
                ),
                (
                    "is_superuser",
                    models.BooleanField(
                        default=False,
                        help_text="Designates that this user has all permissions without explicitly assigning them.",
                        verbose_name="superuser status",
                    ),
                ),
                (
                    "username",
                    models.CharField(
                        error_messages={
                            "unique": "A user with that username already exists."
                        },
                        help_text="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.",
                        max_length=150,
                        unique=True,
                        validators=[
                            django.contrib.auth.validators.UnicodeUsernameValidator()
                        ],
                        verbose_name="username",
                    ),
                ),
                (
                    "is_staff",
                    models.BooleanField(
                        default=False,
                        help_text="Designates whether the user can log into this admin site.",
                        verbose_name="staff status",
                    ),
                ),
                (
                    "is_active",
                    models.BooleanField(
                        default=True,
                        help_text="Designates whether this user should be treated as active. Unselect this instead of deleting accounts.",
                        verbose_name="active",
                    ),
                ),
                (
                    "date_joined",
                    models.DateTimeField(
                        default=django.utils.timezone.now, verbose_name="date joined"
                    ),
                ),
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("email", models.CharField(max_length=255, unique=True)),
                ("password", models.CharField(max_length=255)),
                ("status", models.CharField(max_length=20)),
                (
                    "cust_type",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to="customer.custtype",
                    ),
                ),
                (
                    "groups",
                    models.ManyToManyField(
                        blank=True,
                        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.Group",
                        verbose_name="groups",
                    ),
                ),
                (
                    "pos_reg",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to="customer.custposreg",
                    ),
                ),
                (
                    "user_permissions",
                    models.ManyToManyField(
                        blank=True,
                        help_text="Specific permissions for this user.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.Permission",
                        verbose_name="user permissions",
                    ),
                ),
            ],
            options={
                "db_table": "cust_acc",
            },
            managers=[
                ("objects", django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name="CustProfile",
            fields=[
                (
                    "cust",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        primary_key=True,
                        serialize=False,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("email", models.CharField(max_length=255)),
                ("phone_num", models.CharField(max_length=15)),
                ("gender", models.CharField(blank=True, max_length=1, null=True)),
                ("birthdate", models.DateField(blank=True, null=True)),
            ],
            options={
                "db_table": "cust_profile",
            },
        ),
    ]
