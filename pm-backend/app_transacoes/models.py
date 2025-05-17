# Create your models here.
from django.db import models
from app_categorias.models import Categoria

class Transacao(models.Model):
    titulo = models.CharField(max_length=100)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    data = models.DateField()
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    descricao = models.TextField(blank=True)

    def __str__(self):
        return self.titulo
