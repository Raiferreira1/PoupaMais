# Create your models here.
from django.db import models
from app_categorias.models import Categoria

class Transacao(models.Model):
    """
    Modelo para representar transações financeiras no sistema.
    
    Este modelo armazena informações sobre transações financeiras,
    incluindo título, valor, data, categoria e uma descrição opcional.
    
    Attributes:
        titulo (str): Título/nome da transação (máx. 100 caracteres)
        valor (Decimal): Valor monetário da transação
        data (Date): Data em que a transação ocorreu
        categoria (Categoria): Categoria à qual a transação pertence
        descricao (str): Descrição detalhada da transação (opcional)
    """
    titulo = models.CharField(max_length=100)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    data = models.DateField()
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    descricao = models.TextField(blank=True)

    def __str__(self):
        """
        Retorna a representação em string da transação.
        
        Returns:
            str: Título da transação
        """
        return self.titulo
