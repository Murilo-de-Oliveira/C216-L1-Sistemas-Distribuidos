.PHONY: install test lint format run help

BACKEND := cd backend
POETRY := $(BACKEND) && poetry run
PYTEST := $(POETRY) pytest

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

help:
	@echo "Comandos disponíveis:"
	@echo "  make install  - instala dependências"
	@echo "  make test     - executa testes"
	@echo "  make lint     - verifica código"
	@echo "  make format   - formata código"
	@echo "  make run      - inicia servidor"