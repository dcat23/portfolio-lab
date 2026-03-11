# Backend Makefile
# Simplified commands for building and deploying backend services

.PHONY: help build build-push test clean docker-build docker-push


# Services
SERVICES := lab-service

help:
	@echo "Backend Build Commands"
	@echo "================================"
	@echo ""
	@echo "Maven Commands:"
	@echo "  make build              - Build all services (Maven)"
	@echo "  make test               - Run tests for all services"
	@echo "  make clean              - Clean all services"
	@echo ""
	@echo "Docker Commands (Spring Boot Buildpacks):"
	@echo "  make docker-build       - Build Docker images locally"
	@echo "  make docker-push        - Build and push images to Artifact Registry"
	@echo "  make docker-build-SERVICE - Build specific service (e.g., make docker-build-quizzer)"
	@echo ""
	@echo "Individual Service Commands:"
	@echo "  make build-SERVICE      - Build specific service (e.g., make build-quizzer)"
	@echo "  make test-SERVICE       - Test specific service (e.g., make test-quizzer)"
	@echo ""
	@echo "Available services: $(SERVICES)"

# Build all services with Maven
build:
	@for service in $(SERVICES); do \
		echo "Building $$service..."; \
		cd $$service && ./mvnw clean install -DskipTests || exit 1; \
		cd ..; \
	done

# Run tests for all services
test:
	@for service in $(SERVICES); do \
		echo "Testing $$service..."; \
		cd $$service && ./mvnw test || exit 1; \
		cd ..; \
	done

# Clean all services
clean:
	@for service in $(SERVICES); do \
		echo "Cleaning $$service..."; \
		cd $$service && ./mvnw clean || exit 1; \
		cd ..; \
	done

# Build Docker images locally using Spring Boot buildpacks
docker-build:
	@echo "Building Docker images..."
	@../scripts/docker/build-images.sh

# Build and push Docker images to Artifact Registry
docker-push:
	@echo "Building and pushing Docker images..."
	@../scripts/docker/build-images.sh --push

deploy:
	@echo "Deploying services..."
	@../scripts/gcloud/deploy-service.sh



# lab service targets
build-lab-service:
	cd lab-service && ./mvnw clean install

test-lab-service:
	cd lab-service && ./mvnw test

docker-build-lab-service:
	../scripts/docker/build-images.sh lab-service

docker-push-lab-service:
	../scripts/docker/build-images.sh --push lab-service

deploy-lab-service:
	../scripts/gcloud/deploy-service.sh lab-service

# Quick shortcuts
bl: build-lab-service
dbl: docker-build-lab-service
dpl: docker-push-lab-service
dl: deploy-lab-service
