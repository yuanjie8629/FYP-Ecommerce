# Generated by Django 4.0.2 on 2022-03-20 15:29

import django.contrib.auth.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Cust',
            fields=[
                ('users_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.users')),
            ],
            options={
                'db_table': 'cust',
                'managed': False,
            },
            bases=('core.users',),
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='CustPosReg',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('ic_num', models.CharField(max_length=15)),
                ('name', models.CharField(max_length=100)),
                ('email', models.CharField(max_length=255)),
                ('phone_num', models.CharField(max_length=15)),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female')], max_length=1)),
                ('birthdate', models.DateField()),
                ('address', models.CharField(max_length=255)),
                ('position', models.CharField(max_length=30)),
                ('marital_status', models.CharField(max_length=20)),
                ('occupation', models.CharField(blank=True, max_length=45, null=True)),
                ('comp_name', models.CharField(blank=True, max_length=100, null=True)),
                ('reg_dt', models.DateTimeField()),
                ('accept', models.IntegerField()),
            ],
            options={
                'db_table': 'cust_pos_reg',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='CustType',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('type', models.CharField(max_length=20)),
            ],
            options={
                'db_table': 'cust_type',
                'managed': False,
            },
        ),
    ]
