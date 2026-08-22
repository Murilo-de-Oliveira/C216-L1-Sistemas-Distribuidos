.PHONY: install test lint format run help

install:
	poetry install

test:
	poetry run pytest

lint:
	poetry run ruff check .

format:
	poetry run ruff format .

run:
	poetry run uvicorn app.main:app --reload

help:
	@echo "Comandos disponíveis:"
	@echo "  make install  - instala dependências"
	@echo "  make test     - executa testes"
	@echo "  make lint     - verifica código"
	@echo "  make format   - formata código"
	@echo "  make run      - inicia servidor"