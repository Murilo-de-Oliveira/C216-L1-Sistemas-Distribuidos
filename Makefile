.PHONY: install test lint format run help

BACKEND := cd backend
POETRY := $(BACKEND) && poetry run
PYTEST := $(POETRY) pytest
COMPOSE := docker compose

install:
	$(BACKEND) && poetry install

test:
	$(PYTEST)

lint:
	$(POETRY) ruff check .

format:
	$(POETRY) ruff format .

run:
	$(POETRY) uvicorn src.app.main:app --reload

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

help:
	@echo "Comandos disponíveis:"
	@echo "  make install    - instala dependências"
	@echo "  make test       - executa testes"
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