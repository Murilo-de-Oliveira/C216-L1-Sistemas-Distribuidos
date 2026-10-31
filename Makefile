.PHONY: install test test-cov lint format run docker-build docker-up docker-down docker-restart docker-logs docker-clean db-upgrade db-downgrade db-current db-history db-migration frontend-install frontend-dev frontend-lint frontend-format frontend-check frontend-test frontend-test-e2e frontend-build check-all

BACKEND := cd backend
POETRY := $(BACKEND) && poetry run
PYTEST := $(POETRY) pytest
COMPOSE := docker compose
NPM := npm --prefix frontend

install:
	$(BACKEND) && poetry install

test:
	$(PYTEST)

test-cov:
	$(PYTEST) --cov=app --cov-report=term-missing

lint:
	$(POETRY) ruff check .

format:
	$(POETRY) ruff format .

run:
	$(POETRY) uvicorn app.main:app --reload

docker-build:
	$(COMPOSE) build --no-cache

docker-up:
	$(COMPOSE) up -d

docker-down:
	$(COMPOSE) down

docker-restart:
	$(COMPOSE) docker-down docker-up

docker-logs:
	$(COMPOSE) logs -format

docker-clean:
	$(COMPOSE) down -v

db-upgrade:
	docker compose exec api alembic upgrade head

db-downgrade:
	docker compose exec api alembic downgrade -1

db-current:
	docker compose exec api alembic current

db-history:
	docker compose exec api alembic history

db-migration:
	docker compose run --rm -v "$(CURDIR)/backend/alembic/versions:/app/alembic/versions" api alembic revision --autogenerate -m "$(MSG)"

frontend-install:
	$(NPM) ci

frontend-dev:
	$(NPM) run dev

frontend-lint:
	$(NPM) run lint

frontend-format:
	$(NPM) run format

frontend-check:
	$(NPM) run check

frontend-test:
	$(NPM) run test

frontend-test-e2e:
	$(NPM) run test:e2e

frontend-build:
	$(NPM) run build

check-all: lint test frontend-check frontend-test frontend-build frontend-test-e2e

help:
	@echo "Comandos disponíveis:"
	@echo "  make install    - instala dependências"
	@echo "  make test       - executa testes"
	@echo "  make test-cov   - executa testes e exibe a cobertura deles"
	@echo "  make lint       - verifica código"
	@echo "  make format     - formata código"
	@echo "  make run        - inicia servidor"
	@echo "Comandos Docker:"
	@echo "  docker-build    - gera os containers docker"
	@echo "  docker-up       - inicia servidor e db em background"
	@echo "  docker-down     - derruba containers"
	@echo "  docker-restart  - reinicia os containers"
	@echo "  docker-logs     - mostra logs dos serviços
	@echo "  docker-clean    - derruba containers E apaga volumes"
	@echo "Comandos Alembic:"
	@echo "  make db-upgrade   - aplica as migrations pendentes"
	@echo "  make db-downgrade - desfaz a última migration"
	@echo "  make db-current   - mostra a versao atual do banco"
	@echo "  make db-history   - lista o histórico de migrations"
	@echo "  make db-migration MSG=\"desc\" - cria uma nova migration"
	@echo "Comandos Frontend:"
	@echo "  make frontend-dev      - inicia o frontend local"
	@echo "  make frontend-lint     - verifica os arquivos do frontend"
	@echo "  make frontend-format   - formata os arquivos do frontend"
	@echo "  make frontend-check    - lint + formatacao"
	@echo "  make frontend-test     - executa os testes do frontend (integração e de unidade)"
	@echo "  make frontend-test-e2e - executa os testes E2E"
	@echo "  make frontend-build    - gera o build de produção"
	@echo "Utils:"
	@echo "  make check-all         - valida backend e frontend"