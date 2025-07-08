#!/usr/bin/env python
"""
Script de teste para verificar se as categorias estão funcionando no backend.
Execute este script para diagnosticar problemas com a API de categorias.
"""

import os
import sys
import django

# Configurar o Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pm-backend.settings')
django.setup()

from app_categorias.models import Categoria
from django.contrib.auth import get_user_model

User = get_user_model()

def test_categories():
    print("=== TESTE DE CATEGORIAS ===")
    
    # 1. Verificar se há categorias no banco
    print("\n1. Verificando categorias no banco:")
    categorias = Categoria.objects.all()
    print(f"Total de categorias: {categorias.count()}")
    
    if categorias.count() == 0:
        print("❌ Nenhuma categoria encontrada no banco!")
        print("Criando categorias padrão...")
        
        # Criar categorias padrão
        categorias_padrao = [
            {'nome': 'Alimentação', 'tipo': 'Despesa'},
            {'nome': 'Transporte', 'tipo': 'Despesa'},
            {'nome': 'Saúde', 'tipo': 'Despesa'},
            {'nome': 'Lazer', 'tipo': 'Despesa'},
            {'nome': 'Educação', 'tipo': 'Despesa'},
            {'nome': 'Moradia', 'tipo': 'Despesa'},
            {'nome': 'Salário', 'tipo': 'Receita'},
            {'nome': 'Outros', 'tipo': 'Despesa'},
        ]
        
        for cat_data in categorias_padrao:
            categoria, created = Categoria.objects.get_or_create(
                nome=cat_data['nome'],
                defaults={'tipo': cat_data['tipo']}
            )
            if created:
                print(f"✅ Criada categoria: {categoria.nome} ({categoria.tipo})")
            else:
                print(f"ℹ️ Categoria já existe: {categoria.nome} ({categoria.tipo})")
    
    else:
        print("✅ Categorias encontradas:")
        for cat in categorias:
            print(f"  - {cat.nome} ({cat.tipo})")
    
    # 2. Verificar se há usuários
    print("\n2. Verificando usuários:")
    usuarios = User.objects.all()
    print(f"Total de usuários: {usuarios.count()}")
    
    if usuarios.count() == 0:
        print("❌ Nenhum usuário encontrado!")
        print("Criando usuário de teste...")
        
        # Criar usuário de teste
        try:
            usuario = User.objects.create_user(
                username='teste',
                email='teste@teste.com',
                password='123456'
            )
            print(f"✅ Usuário criado: {usuario.username}")
        except Exception as e:
            print(f"❌ Erro ao criar usuário: {e}")
    
    else:
        print("✅ Usuários encontrados:")
        for user in usuarios:
            print(f"  - {user.username} ({user.email})")
    
    # 3. Testar serialização
    print("\n3. Testando serialização:")
    try:
        from app_categorias.serializers import CategoriaSerializer
        categorias = Categoria.objects.all()
        serializer = CategoriaSerializer(categorias, many=True)
        data = serializer.data
        print(f"✅ Serialização OK - {len(data)} categorias serializadas")
        
        # Mostrar dados serializados
        for cat in data[:3]:  # Mostrar apenas as primeiras 3
            print(f"  - {cat['nome']} ({cat['tipo']})")
        
    except Exception as e:
        print(f"❌ Erro na serialização: {e}")
    
    print("\n=== TESTE CONCLUÍDO ===")

if __name__ == '__main__':
    test_categories() 