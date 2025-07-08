from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app_categorias.models import Categoria
import re
from app_transacoes.models import Transacao
from django.db.models import Sum
from datetime import date, timedelta

# Create your views here.

# Palavras-chave para categorias (exemplo, pode ser expandido)
CATEGORIA_KEYWORDS = {
    'Alimentação': ['mercado', 'supermercado', 'restaurante', 'comida', 'lanche', 'pizza', 'padaria', 'feira', 'hortifruti'],
    'Transporte': ['uber', 'ônibus', 'combustível', 'gasolina', 'metrô', 'passagem', 'carro', 'taxi', '99', 'cabify'],
    'Saúde': ['farmácia', 'remédio', 'consulta', 'dentista', 'hospital', 'médico', 'exame', 'plano de saúde'],
    'Lazer': ['cinema', 'show', 'bar', 'viagem', 'passeio', 'parque', 'teatro', 'museu', 'shopping'],
    'Educação': ['livro', 'curso', 'faculdade', 'escola', 'material', 'universidade', 'colégio', 'apostila'],
    'Moradia': ['aluguel', 'condomínio', 'luz', 'água', 'internet', 'telefone', 'energia', 'gás', 'iptu'],
    'Salário': ['salário', 'pagamento', 'provento', 'renda', 'ordenado', 'remuneração'],
    'Outros': []
}

def get_categoria_keywords_from_db():
    """
    Busca as palavras-chave das categorias no banco de dados.
    Se não existirem categorias padrão, cria automaticamente.
    """
    # Verificar se existem categorias no banco
    if Categoria.objects.count() == 0:
        print("Nenhuma categoria encontrada. Criando categorias padrão...")
        from django.core.management import call_command
        call_command('criar_categorias_padrao')
    
    # Buscar todas as categorias
    categorias = Categoria.objects.all()
    keywords_dict = {}
    
    for categoria in categorias:
        # Mapear palavras-chave baseadas no nome da categoria
        if categoria.nome == 'Alimentação':
            keywords_dict[categoria.nome] = ['mercado', 'supermercado', 'restaurante', 'comida', 'lanche', 'pizza', 'padaria', 'feira', 'hortifruti']
        elif categoria.nome == 'Transporte':
            keywords_dict[categoria.nome] = ['uber', 'ônibus', 'combustível', 'gasolina', 'metrô', 'passagem', 'carro', 'taxi', '99', 'cabify']
        elif categoria.nome == 'Saúde':
            keywords_dict[categoria.nome] = ['farmácia', 'remédio', 'consulta', 'dentista', 'hospital', 'médico', 'exame', 'plano de saúde']
        elif categoria.nome == 'Lazer':
            keywords_dict[categoria.nome] = ['cinema', 'show', 'bar', 'viagem', 'passeio', 'parque', 'teatro', 'museu', 'shopping']
        elif categoria.nome == 'Educação':
            keywords_dict[categoria.nome] = ['livro', 'curso', 'faculdade', 'escola', 'material', 'universidade', 'colégio', 'apostila']
        elif categoria.nome == 'Moradia':
            keywords_dict[categoria.nome] = ['aluguel', 'condomínio', 'luz', 'água', 'internet', 'telefone', 'energia', 'gás', 'iptu']
        elif categoria.nome == 'Salário':
            keywords_dict[categoria.nome] = ['salário', 'pagamento', 'provento', 'renda', 'ordenado', 'remuneração']
        else:
            # Para outras categorias, usar array vazio
            keywords_dict[categoria.nome] = []
    
    return keywords_dict

class CategoriaIASuggestionView(APIView):
    def post(self, request):
        titulo = request.data.get('titulo', '')
        descricao = request.data.get('descricao', '')
        texto = f"{titulo} {descricao}".lower()
        categoria_sugerida = 'Outros'
        
        # Buscar palavras-chave do banco de dados
        categoria_keywords = get_categoria_keywords_from_db()
        
        print(f"=== SUGESTÃO DE CATEGORIA IA ===")
        print(f"Título: '{titulo}'")
        print(f"Descrição: '{descricao}'")
        print(f"Texto completo (lowercase): '{texto}'")
        print(f"Categorias disponíveis: {list(categoria_keywords.keys())}")
        
        for categoria, keywords in categoria_keywords.items():
            print(f"Verificando categoria: {categoria}")
            for kw in keywords:
                print(f"  Testando palavra-chave: '{kw}'")
                if re.search(rf'\b{re.escape(kw)}\b', texto):
                    print(f"  ✅ MATCH! Encontrou '{kw}' em '{texto}'")
                    categoria_sugerida = categoria
                    break
                else:
                    print(f"  ❌ Não encontrou '{kw}' em '{texto}'")
            if categoria_sugerida != 'Outros':
                print(f"Parou na categoria: {categoria_sugerida}")
                break
        
        print(f"Categoria sugerida: {categoria_sugerida}")
        
        # Buscar categoria no banco (se existir)
        categoria_obj = Categoria.objects.filter(nome__iexact=categoria_sugerida).first()
        print(f"Categoria encontrada no banco: {categoria_obj}")
        
        # Se não encontrou a categoria sugerida, usar "Outros"
        if not categoria_obj:
            print(f"Categoria '{categoria_sugerida}' não encontrada no banco")
            categoria_obj = Categoria.objects.filter(nome__iexact='Outros').first()
            if not categoria_obj:
                # Criar categoria "Outros" se não existir
                categoria_obj, created = Categoria.objects.get_or_create(
                    nome='Outros',
                    defaults={'tipo': 'Despesa', 'descricao': 'Categoria para transações não classificadas'}
                )
                print(f"Criada categoria 'Outros': {categoria_obj}")
            else:
                print(f"Usando categoria 'Outros': {categoria_obj}")
        
        categoria_id = categoria_obj.id if categoria_obj else None
        print(f"ID da categoria retornada: {categoria_id}")
        
        return Response({
            'categoria_sugerida': categoria_sugerida,
            'categoria_id': categoria_id
        }, status=status.HTTP_200_OK)

class AnaliseGastosView(APIView):
    def get(self, request):
        try:
            print("=== INICIANDO ANÁLISE DE GASTOS ===")
            hoje = date.today()
            print(f"Data atual: {hoje}")
            
            # Pegar parâmetro de período da query string
            periodo_meses = request.GET.get('periodo', '1')  # Padrão: 1 mês
            print(f"Parâmetro recebido: {request.GET}")
            print(f"Periodo raw: {periodo_meses}")
            try:
                periodo_meses = int(periodo_meses)
            except ValueError:
                periodo_meses = 1
            
            print(f"Período solicitado: {periodo_meses} meses")
            
            # Calcular data de início baseada no período
            if periodo_meses == 0:  # Todas as transações
                transacoes = Transacao.objects.all()
                periodo_analisado = 'todas as transações'
                data_inicio = None  # Não há data de início para todas as transações
            else:
                if periodo_meses == 1:
                    # Para mês atual, usar primeiro dia do mês
                    data_inicio = hoje.replace(day=1)
                    periodo_analisado = 'mês atual'
                else:
                    # Para outros períodos, usar 30 dias * número de meses
                    data_inicio = hoje - timedelta(days=30 * periodo_meses)
                    periodo_analisado = f'últimos {periodo_meses} meses'
                
                transacoes = Transacao.objects.filter(data__gte=data_inicio)
            
            print(f"Data de início calculada: {data_inicio}")
            print(f"Transações encontradas: {transacoes.count()}")
            print(f"Período definido: {periodo_analisado}")
            
            # Log detalhado das transações encontradas
            print("=== TRANSAÇÕES ENCONTRADAS ===")
            for t in transacoes:
                print(f"- {t.data}: {t.titulo} | {t.categoria.nome} | R$ {t.valor}")
            
            # Se há poucas transações, expandir o período (mas manter o período original informado)
            periodo_original = periodo_analisado
            transacoes_originais = transacoes.count()
            
            # Só expandir se há muito poucos dados (menos de 2 transações)
            if transacoes.count() < 2 and periodo_meses < 12:
                # Expandir para 6 meses se há poucos dados
                data_inicio_ampliado = hoje - timedelta(days=180)
                transacoes_ampliadas = Transacao.objects.filter(data__gte=data_inicio_ampliado)
                if transacoes_ampliadas.count() > transacoes.count():
                    transacoes = transacoes_ampliadas
                    periodo_analisado = f'{periodo_original} (expandido para 6 meses - {transacoes_originais} → {transacoes.count()} transações)'
                    print(f"Período expandido automaticamente: {transacoes.count()} transações")
                    print("=== TRANSAÇÕES APÓS EXPANSÃO ===")
                    for t in transacoes:
                        print(f"- {t.data}: {t.titulo} | {t.categoria.nome} | R$ {t.valor}")
            
            # Se ainda há poucos dados, usar todas as transações
            if transacoes.count() < 2:
                transacoes = Transacao.objects.all()
                periodo_analisado = f'{periodo_original} (expandido para todas as transações - {transacoes_originais} → {transacoes.count()} transações)'
                print(f"Usando todas as transações: {transacoes.count()}")
                print("=== TODAS AS TRANSAÇÕES ===")
                for t in transacoes:
                    print(f"- {t.data}: {t.titulo} | {t.categoria.nome} | R$ {t.valor}")
            
            print("=== AGUPANDO POR CATEGORIA ===")
            # Agrupar por categoria
            gastos_por_categoria = (
                transacoes.values('categoria__nome', 'categoria__tipo')
                .annotate(total=Sum('valor'))
                .order_by('-total')
            )
            print(f"Gastos por categoria: {list(gastos_por_categoria)}")
            
            # Separar receitas e despesas
            receitas = [item for item in gastos_por_categoria if item['total'] > 0 or (item['categoria__tipo'] and item['categoria__tipo'].lower() == 'receita')]
            despesas = [item for item in gastos_por_categoria if item['total'] < 0 or (item['categoria__tipo'] and item['categoria__tipo'].lower() == 'despesa')]
            print(f"Receitas: {receitas}")
            print(f"Despesas: {despesas}")
            
            maior_receita = max(receitas, key=lambda x: x['total'], default=None)
            maior_despesa = min(despesas, key=lambda x: x['total'], default=None)  # menor valor negativo
            
            if maior_despesa:
                maior_despesa_nome = maior_despesa['categoria__nome']
                maior_despesa_valor = float(abs(maior_despesa['total']))
            else:
                maior_despesa_nome = None
                maior_despesa_valor = 0
            
            if maior_receita:
                maior_receita_nome = maior_receita['categoria__nome']
                maior_receita_valor = float(maior_receita['total'])
            else:
                maior_receita_nome = None
                maior_receita_valor = 0
            
            total_receitas = sum(item['total'] for item in receitas if item['total'] > 0)
            total_despesas = sum(abs(item['total']) for item in despesas if item['total'] < 0)
            print(f"Total receitas: {total_receitas}")
            print(f"Total despesas: {total_despesas}")
            
            # Converter para float para evitar problemas de tipo
            total_receitas_float = float(total_receitas)
            total_despesas_float = float(total_despesas)
            
            # Sugestão só para despesas
            if maior_despesa_nome and total_despesas_float > 0:
                percentual_maior_despesa = (maior_despesa_valor / total_despesas_float) * 100
                if percentual_maior_despesa > 50:
                    sugestao = f"⚠️ Sua maior despesa é {maior_despesa_nome} ({percentual_maior_despesa:.1f}% das despesas totais). Considere reduzir nesta categoria."
                else:
                    sugestao = f"💡 Sua maior despesa é em {maior_despesa_nome} ({percentual_maior_despesa:.1f}% das despesas). Analise se há oportunidades de economia."
            elif maior_despesa_nome:
                sugestao = f"💡 Sua maior despesa é em {maior_despesa_nome}."
            else:
                sugestao = "✅ Boa gestão! Nenhuma despesa significativa encontrada."
            
            if not gastos_por_categoria:
                sugestao = "📊 Adicione suas primeiras transações para começar a análise."
            
            # Preparar lista das principais despesas
            principais_despesas = []
            for item in despesas:
                if item['total'] < 0:  # Apenas despesas (valores negativos)
                    valor = float(abs(item['total']))
                    percentual = (valor / total_despesas_float * 100) if total_despesas_float > 0 else 0
                    principais_despesas.append({
                        'categoria': item['categoria__nome'],
                        'valor': valor,
                        'percentual': percentual
                    })
            
            # Ordenar por valor (maior primeiro)
            principais_despesas.sort(key=lambda x: x['valor'], reverse=True)
            print(f"Principais despesas: {principais_despesas}")
            
            print("=== ANÁLISE CONCLUÍDA COM SUCESSO ===")
            
            return Response({
                'gastos_por_categoria': list(gastos_por_categoria),
                'maior_receita': maior_receita_nome,
                'maior_receita_valor': maior_receita_valor,
                'maior_despesa': maior_despesa_nome,
                'maior_despesa_valor': maior_despesa_valor,
                'total_receitas': total_receitas_float,
                'total_despesas': total_despesas_float,
                'principais_despesas': principais_despesas[:5],  # Top 5 despesas
                'sugestao': sugestao,
                'periodo_analisado': periodo_analisado,
                'total_transacoes_analisadas': transacoes.count()
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"ERRO NA ANÁLISE DE GASTOS: {str(e)}")
            import traceback
            print(f"Traceback: {traceback.format_exc()}")
            return Response({
                'error': 'Erro interno na análise de gastos',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
