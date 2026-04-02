#!/bin/bash
set -e

echo "Instalando laravel/sail --dev..."
docker run --rm -u "$(id -u):$(id -g)" -v "$(pwd):/app" -w /app laravelsail/php83-composer:latest composer require laravel/sail --dev

echo "Configurando PostgreSQL com Sail..."
docker run --rm -u "$(id -u):$(id -g)" -v "$(pwd):/app" -w /app laravelsail/php83-composer:latest php artisan sail:install --with=pgsql

echo "Iniciando os contentores Docker do Laravel Sail em background..."
./vendor/bin/sail up -d
echo "A aguardar inicialização da Base de Dados..."
sleep 10

echo "Instalando o pacote Laravel Breeze..."
./vendor/bin/sail composer require laravel/breeze --dev

echo "Configurando a stack React com Inertia.js..."
# Tenta run first com flag --no-interaction
./vendor/bin/sail artisan breeze:install react --no-interaction || yes | ./vendor/bin/sail artisan breeze:install react

echo "Executando as migrações da base de dados no PostgreSQL..."
n=0
until [ "$n" -ge 10 ]
do
   ./vendor/bin/sail artisan migrate && break
   echo "Aguardando mais 5s que o PostgreSQL inicie..."
   n=$((n+1)) 
   sleep 5
done

echo "Instalando as dependências do Node e compilando os assets..."
./vendor/bin/sail npm install
./vendor/bin/sail npm run build

echo "Processo concluído com sucesso!"
