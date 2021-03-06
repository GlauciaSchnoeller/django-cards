# Generated by Django 2.2.14 on 2020-07-27 16:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('cards', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CardFile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=255, null=True, verbose_name='Name')),
                ('file', models.FileField(upload_to='cards_files/')),
                ('card', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='files', to='cards.Card')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='cards_files', to=settings.AUTH_USER_MODEL, verbose_name='User')),
            ],
            options={
                'ordering': ['id'],
            },
        ),
    ]
