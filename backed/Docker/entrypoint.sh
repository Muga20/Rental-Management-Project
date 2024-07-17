#!/bin/bash

# Function to check if MySQL is ready
wait_for_mysql() {
    echo "Waiting for MySQL to be ready..."
    ./Docker/wait-for-it.sh database:3306 -t 60
}

# Check if composer dependencies need to be installed
if [ ! -f "vendor/autoload.php" ]; then
    composer install --no-progress --no-interaction
fi

# Check if .env file exists; create from example if not
if [ ! -f ".env" ]; then
    echo "Creating env file for env $APP_ENV"
    cp .env.example .env
else
    echo "env file exists."
fi

# Determine the container role (defaulting to 'app' if not set)
role=${CONTAINER_ROLE:-app}

# Actions based on container role
if [ "$role" = "app" ]; then
    # Wait for MySQL to be ready
    wait_for_mysql

    # Generate Laravel application key and clear caches
    php artisan key:generate
    php artisan cache:clear
    php artisan config:clear
    php artisan route:clear

    # Run migrations and seed the database
    echo "Running migrations..."
    php artisan migrate --seed || exit 1
    echo "Migrations completed."

    # Start Laravel server
    echo "Starting Laravel server..."
    php artisan serve --port=$PORT --host=0.0.0.0 --env=.env
    exec docker-php-entrypoint "$@"
elif [ "$role" = "queue" ]; then
    echo "Running the queue ... "
    php /var/www/artisan queue:work --verbose --tries=3 --timeout=180
elif [ "$role" = "websocket" ]; then
    echo "Running the websocket server ... "
    php artisan websockets:serve
fi
