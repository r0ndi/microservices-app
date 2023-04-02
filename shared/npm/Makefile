.DEFAULT_GOAL := help

help: ## -> show this help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
.PHONY: help

pack: ## -> update dependencies, build and pack npm shared
	npm ci
	npm run lint
	npm test
	npm run build
	rm -fv shared-npm-*.tgz
	npm pack

clean:
	rm -rf build
	rm -rf node_modules
