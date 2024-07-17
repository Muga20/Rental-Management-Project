# Introduction

## Getting Started

### Cloning the Project

1. Clone the project from GitHub using the following command:
   ```bash
   git clone https://github.com/Muga20/HabitatHub-Server.git
   ```
2. Navigate to the project directory:
   ```bash
   cd HabitatHub-Server
   ```

### Setting Up the Environment

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and set up your database connection. Create a database with the name provided in the `.env` file under `DB_DATABASE`.

### Running Migrations and Seeding

3. Execute the following command to create the database and run the migration:
   ```bash
   php artisan migrate --seed
   ```

### Running the Server

1. To start your server, execute:
   ```bash
   php artisan serve
   ```
2. Additionally, to ensure queues and websockets are working, run:
   ```bash
   php artisan queue:work
   php artisan websocket:serve
   ```

## Running the Docker Container

3. Run the Docker container with the following command:
   ```bash
   - docker-compose up 
   - sudo docker-compose up queue
   ```

### Developing with VS Code

1. Open the project directory in VS Code:
   - Open VS Code.
   - Select `File > Open Folder` and choose your project directory (`HabitatHub-Server`).

2. Ensure that any changes made in VS Code are reflected in the Docker container due to the volume mapping in `docker-compose.yml`.

### Executing Artisan Commands

1. Run the necessary Artisan commands inside the Docker container:
   ```bash
   docker exec -it <container_id> php artisan migrate --seed
   docker exec -it <container_id> php artisan queue:work
   docker exec -it <container_id> php artisan websocket:serve
   ```


  


