from django.core.management.base import BaseCommand
from app_categorias.models import Categoria

class Command(BaseCommand):
    help = 'Cria categorias padrão do sistema'

    def handle(self, *args, **options):
        # Categorias padrão com suas palavras-chave
        categorias_padrao = [
            {
                'nome': 'Alimentação',
                'tipo': 'Despesa',
                'descricao': 'Gastos com alimentação, mercado, restaurantes, etc.',
                'palavras_chave': ['mercado', 'supermercado', 'restaurante', 'comida', 'lanche', 'pizza', 'padaria', 'feira', 'hortifruti']
            },
            {
                'nome': 'Transporte',
                'tipo': 'Despesa',
                'descricao': 'Gastos com transporte público, combustível, etc.',
                'palavras_chave': ['uber', 'ônibus', 'combustível', 'gasolina', 'metrô', 'passagem', 'carro', 'taxi', '99', 'cabify']
            },
            {
                'nome': 'Saúde',
                'tipo': 'Despesa',
                'descricao': 'Gastos com saúde, farmácia, consultas médicas, etc.',
                'palavras_chave': ['farmácia', 'remédio', 'consulta', 'dentista', 'hospital', 'médico', 'exame', 'plano de saúde']
            },
            {
                'nome': 'Lazer',
                'tipo': 'Despesa',
                'descricao': 'Gastos com entretenimento, lazer, etc.',
                'palavras_chave': ['cinema', 'show', 'bar', 'viagem', 'passeio', 'parque', 'teatro', 'museu', 'shopping']
            },
            {
                'nome': 'Educação',
                'tipo': 'Despesa',
                'descricao': 'Gastos com educação, cursos, material escolar, etc.',
                'palavras_chave': ['livro', 'curso', 'faculdade', 'escola', 'material', 'universidade', 'colégio', 'apostila']
            },
            {
                'nome': 'Moradia',
                'tipo': 'Despesa',
                'descricao': 'Gastos com moradia, aluguel, contas, etc.',
                'palavras_chave': ['aluguel', 'condomínio', 'luz', 'água', 'internet', 'telefone', 'energia', 'gás', 'iptu']
            },
            {
                'nome': 'Salário',
                'tipo': 'Receita',
                'descricao': 'Receitas de salário e rendimentos',
                'palavras_chave': ['salário', 'pagamento', 'provento', 'renda', 'ordenado', 'remuneração']
            },
            {
                'nome': 'Outros',
                'tipo': 'Despesa',
                'descricao': 'Categoria para transações não classificadas',
                'palavras_chave': []
            }
        ]

        self.stdout.write('Criando categorias padrão...')
        
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
                self.stdout.write(
                    self.style.SUCCESS(f'✅ Criada categoria: {categoria.nome} ({categoria.tipo})')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'ℹ️ Categoria já existe: {categoria.nome} ({categoria.tipo})')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'\n🎉 Processo concluído! Total de categorias: {Categoria.objects.count()}')
        ) 