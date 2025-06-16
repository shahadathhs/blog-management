### * Docker Setup for Blog Management * ###
# ─────────────────────────────────────────────────────────────────────────────
COMPOSE_FILE := docker-compose.yml
PROJECT_NAME := blog-management
SERVICE      := api
IMAGE        := shahadathhs/blog-management:latest
CONTAINER    := blog-management-api
NETWORK      := blog-network

# shorthand for docker‐compose
DC := docker compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE)

.PHONY: help up down restart logs ps prune rebuild shell \
        create-network check-env clean-hard prune-all view-* \
        stop-container restart-container run-container rebuild-container \
        exec-shell remove push build pull

# ─────────────────────────────────────────────────────────────────────────────
help:
	@echo "📘 Usage:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ─────────────────────────────────────────────────────────────────────────────
up: ## Build & start services
	@echo "🚀 Starting containers..."
	@$(DC) up -d

down: ## Stop & remove containers + volumes
	@echo "🛑 Stopping and removing containers..."
	@$(DC) down -v

restart: down up ## Restart all services

logs: ## Tail logs
	@echo "📜 Logs:"
	@$(DC) logs -f

ps: ## Show container status
	@$(DC) ps

build: ## Build docker image
	@echo "🔨 Building image..."
	@docker build -t $(IMAGE) .

push: ## Push image to Docker Hub
	docker push $(IMAGE)

pull: ## Pull latest image
	docker pull $(IMAGE)

remove: ## Remove Docker image
	docker rmi $(IMAGE)

prune: ## Prune dangling resources
	@docker system prune -f
	@docker volume prune -f

rebuild: down build up ## Rebuild everything

shell: ## Open shell inside container
	@$(DC) exec $(SERVICE) sh

check-env: ## Print env file
	@test -f .env && cat .env || echo ".env file not found"

# ─────────────────────────────────────────────────────────────────────────────
create-network: ## Create custom Docker network
	@docker network ls | grep -w $(NETWORK) >/dev/null || docker network create $(NETWORK)

run-container: create-network ## Run container
	docker run --rm --env-file .env \
		-v "$$(pwd):/app" \
		-v /app/node_modules \
		-v /app/generated \
		-p 8080:8080 \
		--name $(CONTAINER) \
		--network $(NETWORK) \
		$(IMAGE)

stop-container: ## Stop container
	docker stop $(CONTAINER)

restart-container: stop start ## Restart the container

rebuild-container: stop-container remove-container build run-container ## Rebuild & run again

exec-shell: ## Open shell in container
	docker exec -it $(CONTAINER) sh

# ─────────────────────────────────────────────────────────────────────────────
prune-all: ## Prune everything
	docker container prune -f
	docker image prune -f
	docker volume prune -f
	docker network prune -f

clean-hard: ## Stop & remove everything related
	-docker stop $(CONTAINER)
	-docker rm $(CONTAINER)
	-docker rmi $(IMAGE)
	make prune-all

# ─────────────────────────────────────────────────────────────────────────────
view-containers: ## List all containers
	docker ps -a

view-running: ## Show running containers
	docker ps

view-images: ## Show Docker images
	docker images

view-volumes: ## Show Docker volumes
	docker volume ls

view-networks: ## Show Docker networks
	docker network ls
