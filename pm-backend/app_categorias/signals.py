from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.apps import apps
from .models import Categoria

@receiver(post_migrate)
def criar_categorias_padrao_apos_migracao(sender, **kwargs):
    """
    Signal que cria categorias padrão automaticamente após migrações.
    Garante que as categorias estejam sempre disponíveis.
    """
    # Verificar se é o app correto
    if sender.name == 'app_categorias':
        print("=== VERIFICANDO CATEGORIAS PADRÃO ===")
        
        # Categorias padrão com suas palavras-chave
        categorias_padrao = [
            {
                'nome': 'Alimentação',
                'tipo': 'Despesa',
                'descricao': 'Gastos com alimentação, mercado, restaurantes, etc.'
            },
            {
                'nome': 'Transporte',
                'tipo': 'Despesa',
                'descricao': 'Gastos com transporte público, combustível, etc.'
            },
            {
                'nome': 'Saúde',
                'tipo': 'Despesa',
                'descricao': 'Gastos com saúde, farmácia, consultas médicas, etc.'
            },
            {
                'nome': 'Lazer',
                'tipo': 'Despesa',
                'descricao': 'Gastos com entretenimento, lazer, etc.'
            },
            {
                'nome': 'Educação',
                'tipo': 'Despesa',
                'descricao': 'Gastos com educação, cursos, material escolar, etc.'
            },
            {
                'nome': 'Moradia',
                'tipo': 'Despesa',
                'descricao': 'Gastos com moradia, aluguel, contas, etc.'
            },
            {
                'nome': 'Salário',
                'tipo': 'Receita',
                'descricao': 'Receitas de salário e rendimentos'
            },
            {
                'nome': 'Outros',
                'tipo': 'Despesa',
                'descricao': 'Categoria para transações não classificadas'
            }
        ]
        
        categorias_criadas = 0
        categorias_existentes = 0
        
        for cat_data in categorias_padrao:
            categoria, created = Categoria.objects.get_or_create(
                nome=cat_data['nome'],
                defaults={
                    'tipo': cat_data['tipo'],
                    'descricao': cat_data['descricao'],
                    'padrao': True  # Marcar como categoria padrão
                }
            )
            
            # Se a categoria já existia mas não estava marcada como padrão, atualizar
            if not created and not categoria.padrao:
                categoria.padrao = True
                categoria.save()
                print(f"🔄 Categoria marcada como padrão: {categoria.nome}")
            
            if created:
                categorias_criadas += 1
                print(f"✅ Criada categoria: {categoria.nome} ({categoria.tipo})")
            else:
                categorias_existentes += 1
                print(f"ℹ️ Categoria já existe: {categoria.nome} ({categoria.tipo})")
        
        print(f"📊 Resumo: {categorias_criadas} criadas, {categorias_existentes} existentes")
        print(f"🎉 Total de categorias no sistema: {Categoria.objects.count()}")
        print("=== CATEGORIAS PADRÃO VERIFICADAS ===") 