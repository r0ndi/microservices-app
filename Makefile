#!/usr/bin/make -f

.DEFAULT_GOAL := help

help: ## show this help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
.PHONY: help

pre-run: ## create and run rental containers
	docker compose build --pull && docker compose up -d --force-recreate

run: ## run application - use in container!
	make -C shared/npm clean pack
	make -C modules/api-gateway clean run
	make -C modules/customer clean run
	make -C modules/client-app clean run

re-create: ## recreate modules - use in container!
	pm2 kill && make run

clean: ## create and run rental containers
	docker compose down

stop: ## stop rental containers
	docker compose stop

start: ## start rental containers
	docker compose start

sh-ci: ## enter to base app container
	docker exec -it base-app /bin/bash

