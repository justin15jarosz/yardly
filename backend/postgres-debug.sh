#!/bin/bash

echo "=== PostgreSQL Debug and Reset Script ==="
echo ""

# Function to test database connection
test_connection() {
    echo "Testing PostgreSQL connection..."
    docker exec -it postgres-db psql -U postgres -d yardly -c "SELECT version();" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✓ Connection successful"
        return 0
    else
        echo "✗ Connection failed"
        return 1
    fi
}

# Function to reset PostgreSQL
reset_postgres() {
    echo "Resetting PostgreSQL..."
    echo "1. Stopping containers..."
    docker-compose stop postgres
    
    echo "2. Removing PostgreSQL container..."
    docker-compose rm -f postgres
    
    echo "3. Removing PostgreSQL volume..."
    docker volume rm $(docker-compose config | grep -A 10 volumes: | grep postgres_data | awk '{print $1}' | sed 's/:$//')_postgres_data 2>/dev/null || echo "Volume not found or already removed"
    
    echo "4. Starting PostgreSQL with fresh data..."
    docker-compose up -d postgres
    
    echo "5. Waiting for PostgreSQL to be ready..."
    sleep 15
    
    echo "6. Testing connection..."
    test_connection
}

# Function to show current status
show_status() {
    echo "=== Current Status ==="
    echo "PostgreSQL container status:"
    docker-compose ps postgres
    echo ""
    
    echo "PostgreSQL logs (last 10 lines):"
    docker-compose logs --tail=10 postgres
    echo ""
    
    echo "Testing connection from host..."
    docker exec postgres-db pg_isready -U postgres -d microservices_db
    echo ""
}

# Function to create test tables
create_test_tables() {
    echo "Creating test tables..."
    docker exec -i postgres-db psql -U postgres -d microservices_db << 'EOF'
-- Create test tables for each service
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS auth_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test data
INSERT INTO users (username, email) VALUES 
    ('testuser', 'test@example.com')
ON CONFLICT (username) DO NOTHING;

-- Show tables
\dt
EOF
}

# Function to test from service containers
test_from_services() {
    echo "Testing database connection from service containers..."
    
    services=("auth-service" "user-service")
    for service in "${services[@]}"; do
        echo "--- Testing from $service ---"
        if docker-compose ps | grep -q $service; then
            # Try to connect using the service's environment variables
            docker exec $service sh -c '
                if command -v pg_isready > /dev/null; then
                    pg_isready -h postgres -p 5432 -U postgres -d microservices_db
                else
                    echo "pg_isready not available, trying nc..."
                    nc -zv postgres 5432 2>&1 || echo "Connection failed"
                fi
            ' 2>/dev/null || echo "$service container not running or connection failed"
        else
            echo "$service container not running"
        fi
        echo ""
    done
}

# Main menu
case "$1" in
    "status")
        show_status
        ;;
    "reset")
        reset_postgres
        ;;
    "test")
        test_connection
        ;;
    "tables")
        create_test_tables
        ;;
    "services")
        test_from_services
        ;;
    "fix")
        echo "=== Attempting to fix PostgreSQL issues ==="
        reset_postgres
        sleep 10
        create_test_tables
        test_from_services
        ;;
    *)
        echo "Usage: $0 {status|reset|test|tables|services|fix}"
        echo ""
        echo "Commands:"
        echo "  status   - Show current PostgreSQL status and logs"
        echo "  reset    - Reset PostgreSQL (removes data!)"
        echo "  test     - Test database connection"
        echo "  tables   - Create test tables and data"
        echo "  services - Test connection from service containers"
        echo "  fix      - Attempt to fix all issues (reset + setup)"
        echo ""
        exit 1
        ;;
esac