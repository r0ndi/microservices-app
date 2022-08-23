MODULE_NAME := 'test-client'

include ../../MakefileNpm.mk

run-test-client:
	npm i
	npm run lint
	npm run build
	node build/boot.js
