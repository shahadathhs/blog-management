### * Docker Compose * ###
# ─────────────────────────────────────────────────────────────────────────────
# Project-wide vars
COMPOSE_FILE := docker-compose.yml
PROJECT_NAME := blog-management
SERVICE      := api
IMAGE        := shahadathhs/blog-management:latest

# shorthand for docker‐compose
DC := docker compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE)

# ─────────────────────────────────────────────────────────────────────────────
.PHONY: help up down restart logs ps build prune rebuild gen migrate shell

help:
	@echo "Usage:"
	@echo "  make up          # Build & start containers (detached)"
	@echo "  make down        # Stop & remove containers + volumes"
	@echo "  make restart     # Restart all services"
	@echo "  make logs        # Follow logs for all services"
	@echo "  make ps          # List containers"
	@echo "  make build       # Build/rebuild images"
	@echo "  make prune       # Prune dangling containers/images/volumes"
	@echo "  make rebuild     # Down, build, then up"
	@echo
	@echo "  make gen         # Generate Prisma client inside the api container"
	@echo "  make migrate     # Run Prisma migrations (dev) inside the api container"
	@echo "  make shell       # Open a shell in the api container"

# ─────────────────────────────────────────────────────────────────────────────
up:
	@echo "🚀 Starting $(PROJECT_NAME)..."
	@$(DC) up -d

down:
	@echo "🛑 Stopping $(PROJECT_NAME) & removing containers + volumes..."
	@$(DC) down -v

restart: down up

logs:
	@echo "📜 Tailing logs for $(PROJECT_NAME)..."
	@$(DC) logs -f

ps:
	@echo "📦 Containers status:"
	@$(DC) ps

build:
	@echo "🔨 Building images..."
	@$(DC) build --no-cache

prune:
	@echo "🧹 Pruning dangling containers, images, volumes..."
	@docker system prune -f
	@docker volume prune -f

rebuild: down build up

shell:
	@echo "🔧 Opening shell in $(SERVICE)..."
	@$(DC) exec $(SERVICE) sh

# ─────────────────────────────────────────────────────────────────────────────

# * ---------------------------------------------- * #

### * Dockerfile * ###
# === Build ===
build:
	docker build -t shahadathhs/blog-management:latest .

# === Push ===
push:
	docker push shahadathhs/blog-management:latest

# === Run (Bind Mount) ===
run:
	docker run --env-file .env \
		-v "$$(pwd)/logs:/app/logs" \
		-p 4000:4000 \
		--name ts-app-container-prod \
		--network ph-docker-network \
		shahadathhs/blog-management:prod

run-temp:
	docker run --rm --env-file .env \
		-v "$$(pwd)/logs:/app/logs" \
		-p 4000:4000 \
		--name ts-app-container-prod \
		--network ph-docker-network \
		shahadathhs/blog-management:prod

# === Run (Named Volume) ===
run-volume:
	docker run --env-file .env \
		-v ts-app-logs-latest:/app/logs \
		-p 4000:4000 \
		--name ts-app-container-latest \
		--network ph-docker-network \
		shahadathhs/blog-management:latest

run-temp-volume:
	docker run --rm --env-file .env \
		-v ts-app-logs-latest:/app/logs \
		-p 4000:4000 \
		--name ts-app-container-latest \
		--network ph-docker-network \
		shahadathhs/blog-management:latest

# === Start ===
start:
	docker start ts-app-container-latest

start-attached:
	docker start -a ts-app-container-latest

# === Stop ===
stop:
	docker stop ts-app-container-latest

# === Restart ===
restart-container:
	docker stop ts-app-container-latest || true
	docker start -a ts-app-container-latest

# === Remove Containers ===
remove-container:
	docker rm ts-app-container-latest

# === Remove Images ===
remove-image:
	docker rmi shahadathhs/blog-management:latest

# === Rebuild ===
rebuild-container:
	make stop-prod
	make remove-container-prod
	make build-prod
	make run-prod

rebuild-container-volume:
	make stop-latest
	make remove-container-latest
	make build-latest
	make run-latest-volume

# === Logs ===
logs-follow:
	docker logs -f ts-app-container-latest

# === Exec ===
exec-shell:
	docker exec -it ts-app-container-latest sh

# === Env Check ===
check-env:
	@echo "Printing .env variables:"
	@cat .env

# === Prune & Clean ===
prune-all:
	docker container prune -f
	docker image prune -f
	docker volume prune -f

clean-hard:
	-docker stop ts-app-container-latest
	-docker rm ts-app-container-latest
	-docker rmi shahadathhs/blog-management:prod
	docker container prune -f
	docker image prune -f
	docker volume prune -f
	docker network prune -f

# === View Volume, Images & Containers & Networks ===
view-containers:
	docker ps -a

view-running:
	docker ps

view-images:
	docker images

view-volumes:
	docker volume ls

view-networks:
	docker network ls
