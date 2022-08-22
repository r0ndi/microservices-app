.DEFAULT_GOAL := help

help: ## -> show this help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
.PHONY: help

run: ## -> build and start module
	npm update shared-npm
	npm i
	npm run lint
	npm test
	npm run build
	node build/boot.js

clean:
	rm -rf build
	rm -rf node_modules
