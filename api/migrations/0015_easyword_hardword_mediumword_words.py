# Generated by Django 3.1.5 on 2021-02-02 18:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_auto_20210202_1838'),
    ]

    operations = [
        migrations.CreateModel(
            name='EasyWord',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('word', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='HardWord',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('word', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='MediumWord',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('word', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='Words',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('easy', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='easy', to='api.easyword')),
                ('hard', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='hard', to='api.hardword')),
                ('medium', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='medium', to='api.mediumword')),
            ],
        ),
    ]
