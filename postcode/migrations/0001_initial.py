# Generated by Django 4.0.2 on 2022-03-19 19:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='City',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=45)),
            ],
            options={
                'db_table': 'city',
            },
        ),
        migrations.CreateModel(
            name='State',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=45)),
            ],
            options={
                'db_table': 'state',
            },
        ),
        migrations.CreateModel(
            name='Postcode',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('code', models.CharField(max_length=5)),
                ('city', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='postcode.city')),
            ],
            options={
                'db_table': 'postcode',
            },
        ),
        migrations.AddField(
            model_name='city',
            name='state',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='postcode.state'),
        ),
    ]
