# Generated by Django 4.0.2 on 2022-03-23 21:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('order', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('last_update', models.DateTimeField(auto_now=True)),
                ('is_deleted', models.BooleanField(default=False)),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('method', models.CharField(max_length=20)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('paid', models.BooleanField()),
                ('reference_num', models.CharField(max_length=50)),
                ('created_tms', models.DateTimeField()),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='order.order')),
            ],
            options={
                'db_table': 'payment',
            },
        ),
    ]
