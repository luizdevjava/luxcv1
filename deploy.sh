#!/bin/bash

echo "🚀 Iniciando deploy do Lux Companions..."

# Verificar se está na branch main
if [ "$(git branch --show-current)" != "main" ]; then
    echo "❌ Você não está na branch main"
    exit 1
fi

# Adicionar arquivos
git add .

# Commit
echo "📝 Fazendo commit..."
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M:%S')"

# Push
echo "📤 Enviando para GitHub..."
git push origin main

echo "✅ Deploy iniciado! Aguarde a Vercel processar..."
echo "🌐 Seu site estará disponível em: https://lux-companions.vercel.app"