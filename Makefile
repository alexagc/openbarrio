# OpenBarrio Makefile 🏘️

.PHONY: all install build test lint clean dev dev-api dev-web dev-ext docker-up docker-down docker-test docker-lint docker-seed

PNPM ?= pnpm
DOCKER_COMPOSE ?= docker compose

all: lint test build

# Local Docker Workflow (Zero-Pollution)
docker-up:
	$(DOCKER_COMPOSE) up --build

docker-down:
	$(DOCKER_COMPOSE) down

docker-test:
	$(DOCKER_COMPOSE) run --rm openbarrio pnpm test

docker-lint:
	$(DOCKER_COMPOSE) run --rm openbarrio pnpm lint

docker-seed:
	$(DOCKER_COMPOSE) run --rm openbarrio node scripts/init-local-db.mjs

install:
	$(PNPM) install

build:
	$(PNPM) run build

test:
	$(PNPM) run test

lint:
	$(PNPM) run lint

clean:
	rm -rf node_modules dist coverage */node_modules */dist

dev:
	$(PNPM) run dev

dev-api:
	$(PNPM) --filter @openbarrio/api run dev

dev-web:
	$(PNPM) --filter @openbarrio/web run dev

dev-ext:
	$(PNPM) --filter @openbarrio/extension run dev
