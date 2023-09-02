.PHONY: build-RuntimeDependenciesLayer build-lambda-common
.PHONY: build-createTicketFunction build-msgSlackFunction build-replyTicketFunction build-resolveTicketFunction build-getTicketsFunction build-getTicketFunction

build-createTicketFunction:
	$(MAKE) HANDLER=src/handlers/create-ticket.ts build-lambda-common
build-msgSlackFunction:
	$(MAKE) HANDLER=src/handlers/msg-slack.ts build-lambda-common
build-replyTicketFunction:
	$(MAKE) HANDLER=src/handlers/reply-ticket.ts build-lambda-common
build-resolveTicketFunction:
	$(MAKE) HANDLER=src/handlers/resolve-ticket.ts build-lambda-common
build-getTicketsFunction:
	$(MAKE) HANDLER=src/handlers/get-tickets.ts build-lambda-common
build-getTicketFunction:
	$(MAKE) HANDLER=src/handlers/get-ticket.ts build-lambda-common

build-lambda-common:
	npm install
	rm -rf dist
	echo "{\"extends\": \"./tsconfig.json\", \"include\": [\"${HANDLER}\"] }" > tsconfig-only-handler.json
	npm run build -- --build tsconfig-only-handler.json
	cp -r dist "$(ARTIFACTS_DIR)/"

build-RuntimeDependenciesLayer:
	mkdir -p "$(ARTIFACTS_DIR)/nodejs"
	cp package.json package-lock.json "$(ARTIFACTS_DIR)/nodejs/"
	npm install --production --prefix "$(ARTIFACTS_DIR)/nodejs/"
	rm "$(ARTIFACTS_DIR)/nodejs/package.json" # to avoid rebuilding when changes doesn't relate to dependencies
