#!/usr/bin/make -f

.DEFAULT_GOAL := help

help: ## -> show this help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
.PHONY: help

run: ## -> build and start module
	npm update shared-npm
	npm ci
	npm run lint
	npm test
	npm run build
	pm2 start build/boot.js --name $(MODULE_NAME)

upgrade: ## -> build and restart module
	npm run build
	pm2 restart build/boot.js --name $(MODULE_NAME)

restart: ## -> start module
	pm2 restart build/boot.js --name $(MODULE_NAME)

clean:
	rm -rf build
	rm -rf node_modules
