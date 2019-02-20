# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2018-10-04 08:14
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='S3Bucket',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bucket', models.CharField(max_length=255, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Solution',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('solution_id', models.CharField(max_length=255, unique=True)),
                ('solution_name', models.CharField(max_length=255, unique=True)),
                ('solution_type', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('deleted', models.BooleanField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('hocr_type', models.CharField(default='XPMS', max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='SolutionUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_type', models.CharField(choices=[('se', 'Solution_Engineer'), ('bu', 'Business_User'), ('sv', 'Supervisor_User')], max_length=4)),
                ('solution', models.ManyToManyField(to='api.Solution')),
                ('solution_user', models.OneToOneField(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]