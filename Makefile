# * Docker Compose * 
COMPOSE=docker compose
PROJECT_NAME=blog-management
DOCKER_COMPOSE_FILE=docker-compose.yml
ENV_FILE=.env

# Docker Compose Commands
up:
	@echo "🚀 Starting all containers..."
	$(COMPOSE) -p $(PROJECT_NAME) -f $(DOCKER_COMPOSE_FILE) up -d

down:
	@echo "🛑 Stopping and removing all containers & volumes..."
	$(COMPOSE) -p $(PROJECT_NAME) -f $(DOCKER_COMPOSE_FILE) down -v

restart: down up

logs:
	@echo "📜 Showing logs (follow mode)..."
	$(COMPOSE) -p $(PROJECT_NAME) -f $(DOCKER_COMPOSE_FILE) logs -f

ps:
	@echo "📦 Container status:"
	$(COMPOSE) -p $(PROJECT_NAME) -f $(DOCKER_COMPOSE_FILE) ps

build:
	@echo "🔨 Building images (if Docker files are present locally)..."
	$(COMPOSE) -p $(PROJECT_NAME) -f $(DOCKER_COMPOSE_FILE) build

prune:
	@echo "🧹 Pruning dangling containers and volumes..."
	docker system prune -f
	docker volume prune -f

rebuild: down build up

env:
	@echo "📁 ENV file: $(ENV_FILE)"
	@if [ -f $(ENV_FILE) ]; then \
		echo "🔑 Environment Variables:"; \
		cat $(ENV_FILE); \
	else \
		echo "⚠️  ENV file not found."; \

# * ----------------------------------------------

# * Dockerfile *
# === Build ===
build:
	docker build -t shahadathhs/my-ts-app:latest .

# === Push ===
push:
	docker push shahadathhs/my-ts-app:latest

# === Run (Bind Mount) ===
run:
	docker run --env-file .env \
		-v "$$(pwd)/logs:/app/logs" \
		-p 4000:4000 \
		--name ts-app-container-prod \
		--network ph-docker-network \
		shahadathhs/my-ts-app:prod

run-temp:
	docker run --rm --env-file .env \
		-v "$$(pwd)/logs:/app/logs" \
		-p 4000:4000 \
		--name ts-app-container-prod \
		--network ph-docker-network \
		shahadathhs/my-ts-app:prod

# === Run (Named Volume) ===
run-volume:
	docker run --env-file .env \
		-v ts-app-logs-latest:/app/logs \
		-p 4000:4000 \
		--name ts-app-container-latest \
		--network ph-docker-network \
		shahadathhs/my-ts-app:latest

run-temp-volume:
	docker run --rm --env-file .env \
		-v ts-app-logs-latest:/app/logs \
		-p 4000:4000 \
		--name ts-app-container-latest \
		--network ph-docker-network \
		shahadathhs/my-ts-app:latest

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
	docker rmi shahadathhs/my-ts-app:latest

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
	-docker stop ts-app-container-prod
	-docker stop mongodb
	-docker rm ts-app-container-latest
	-docker rm ts-app-container-prod
	-docker rm mongodb
	-docker rmi shahadathhs/my-ts-app:latest
	-docker rmi shahadathhs/my-ts-app:prod
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
