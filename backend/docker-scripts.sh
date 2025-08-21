#!/bin/bash

# Start all services
start_all() {
    echo "Starting all microservices..."
    docker-compose up -d
    echo "Services started. Use 'docker-compose logs -f' to view logs."
}

# Stop all services
stop_all() {
    echo "Stopping all microservices..."
    docker-compose down
}

# Rebuild and start all services
rebuild_all() {
    echo "Rebuilding and starting all microservices..."
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
}

# Start only infrastructure services (postgres, redis, kafka)
start_infra() {
    echo "Starting infrastructure services..."
    docker-compose up -d postgres redis kafka zookeeper
}

# Start specific microservice
start_service() {
    if [ -z "$1" ]; then
        echo "Usage: start_service <service-name>"
        echo "Available services: auth-service, user-service, email-service"
        return 1
    fi
    echo "Starting $1..."
    docker-compose up -d $1
}

# View logs for a specific service
logs() {
    if [ -z "$1" ]; then
        echo "Usage: logs <service-name>"
        return 1
    fi
    docker-compose logs -f $1
}

# Check health of all services
health_check() {
    echo "Checking service health..."
    docker-compose ps
    echo ""
    echo "Detailed health status:"
    docker inspect --format='{{.Name}} - {{.State.Health.Status}}' $(docker-compose ps -q) 2>/dev/null
}

# Scale a specific service
scale_service() {
    if [ -z "$1" ] || [ -z "$2" ]; then
        echo "Usage: scale_service <service-name> <replicas>"
        return 1
    fi
    echo "Scaling $1 to $2 replicas..."
    docker-compose up -d --scale $1=$2
}

# Show help
show_help() {
    echo "Available commands:"
    echo "  start_all      - Start all services"
    echo "  stop_all       - Stop all services"
    echo "  rebuild_all    - Rebuild and restart all services"
    echo "  start_infra    - Start only infrastructure services"
    echo "  start_service  - Start a specific service"
    echo "  logs          - View logs for a service"
    echo "  health_check  - Check health of all services"
    echo "  scale_service - Scale a service to N replicas"
    echo "  show_help     - Show this help message"
}

# Main script logic
case "$1" in
    start_all)
        start_all
        ;;
    stop_all)
        stop_all
        ;;
    rebuild_all)
        rebuild_all
        ;;
    start_infra)
        start_infra
        ;;
    start_service)
        start_service $2
        ;;
    logs)
        logs $2
        ;;
    health_check)
        health_check
        ;;
    scale_service)
        scale_service $2 $3
        ;;
    *)
        show_help
        ;;
esac