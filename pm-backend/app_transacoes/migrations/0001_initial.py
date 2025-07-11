# Generated by Django 5.2 on 2025-05-16 01:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("app_categorias", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Transacao",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("titulo", models.CharField(max_length=100)),
                ("valor", models.DecimalField(decimal_places=2, max_digits=10)),
                ("data", models.DateField()),
                ("descricao", models.TextField(blank=True)),
                (
                    "categoria",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="app_categorias.categoria",
                    ),
                ),
            ],
        ),
    ]
