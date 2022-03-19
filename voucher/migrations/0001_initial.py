# Generated by Django 4.0.2 on 2022-03-19 19:12

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Voucher',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('code', models.CharField(max_length=20, unique=True)),
                ('status', models.CharField(choices=[('active', 'Active'), ('oos', 'Out of Stock'), ('hidden', 'Hidden'), ('scheduled', 'Scheduled'), ('expired', 'Expired')], max_length=20)),
                ('type', models.CharField(max_length=20)),
                ('discount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('min_spend', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('max_discount', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('total_amt', models.IntegerField()),
                ('usage_limit', models.IntegerField()),
                ('auto_apply', models.BooleanField(default=False)),
                ('avail_start_dt', models.DateField()),
                ('avail_end_dt', models.DateField(blank=True, default=datetime.date(9999, 12, 31), null=True)),
            ],
            options={
                'db_table': 'voucher',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='VoucherLine',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'voucher_line',
                'managed': False,
            },
        ),
    ]
