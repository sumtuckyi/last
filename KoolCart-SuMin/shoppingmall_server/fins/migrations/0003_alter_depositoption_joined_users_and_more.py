# Generated by Django 4.2.4 on 2023-11-22 00:01

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('fins', '0002_depositoption_joined_users_depositproduct_like_users_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='depositoption',
            name='joined_users',
            field=models.ManyToManyField(blank=True, related_name='my_deposits', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='depositproduct',
            name='like_users',
            field=models.ManyToManyField(blank=True, related_name='like_deposits', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='savingoption',
            name='joined_users',
            field=models.ManyToManyField(blank=True, related_name='my_savings', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='savingproduct',
            name='like_users',
            field=models.ManyToManyField(blank=True, related_name='like_savings', to=settings.AUTH_USER_MODEL),
        ),
    ]
