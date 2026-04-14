# Docker instructions

Instruções rápidas para iniciar o projeto com Docker Compose.

1. Build e subir os containers:

```bash
docker compose up --build -d
```

2. Instalar dependências PHP e Node (uma vez):

```bash
docker compose exec app composer install
docker compose exec node npm install
```

3. Preparar a aplicação Laravel:

```bash
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate
docker compose exec app php artisan storage:link
```

4. Para executar comandos Node ou MCPs:

```bash
docker compose exec node bash
# dentro do container node: executar seus scripts npm ou mcp
```

Notas:
- O Nginx fica exposto em `http://localhost:8080`.
- Ajuste variáveis de ambiente no seu `.env` local para apontar para a DB `db:3306` ou use as variáveis definidas em `docker-compose.yml`.
