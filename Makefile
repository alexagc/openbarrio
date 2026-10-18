# OpenBarrio Makefile 🏘️

.PHONY: all install build test lint clean dev dev-api dev-web dev-ext

PNPM ?= pnpm

all: lint test build

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
