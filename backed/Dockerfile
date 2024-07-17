FROM php:8.2 as php

# Install dependencies including GD library
RUN apt-get update -y && apt-get install -y unzip libpq-dev libcurl4-gnutls-dev libfreetype6-dev libjpeg62-turbo-dev libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql bcmath gd \
    && pecl install -o -f redis \
    && rm -rf /tmp/pear \
    && docker-php-ext-enable redis

WORKDIR /var/www

# Copy composer binary from composer image
COPY --from=composer:2.3.5 /usr/bin/composer /usr/bin/composer

COPY . .

# Install PHP dependencies
RUN composer install --no-progress --no-interaction

# Copy entrypoint script
COPY Docker/entrypoint.sh /Docker/entrypoint.sh
RUN chmod +x /Docker/entrypoint.sh

ENV PORT=8000

ENTRYPOINT ["Docker/entrypoint.sh"]

# ==============================================================================
# Node.js Stage (if needed)
FROM node:14-alpine as node

WORKDIR /var/www
COPY . .

# RUN npm install --global cross-env
# RUN npm install

# VOLUME /var/www/node_modules
