# Generated by Django 3.2 on 2021-04-19 16:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='APICache',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('query', models.CharField(max_length=255, unique=True, verbose_name='API Cache')),
                ('data', models.TextField(null=True)),
                ('last_updated', models.DateTimeField(null=True)),
            ],
            options={
                'ordering': ['query'],
            },
        ),
        migrations.CreateModel(
            name='Collection',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30, unique=True, verbose_name='Collection name')),
                ('sports', models.TextField(blank=True, max_length=1000)),
                ('field_names', models.TextField(blank=True, max_length=1000)),
                ('field_types', models.TextField(blank=True, max_length=1000)),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Schedule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=False)),
                ('weekdays', models.CharField(max_length=30, unique=True, verbose_name='weekdays')),
                ('time_ranges', models.TextField(blank=True, max_length=1000)),
                ('collection', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.collection', unique=True, verbose_name='collection id')),
            ],
            options={
                'ordering': ['collection'],
            },
        ),
    ]
