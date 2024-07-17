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

1. Execute the following command to create the database and run the migration:
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

## For Docker Users

### Pulling the Docker Image

1. Pull the Docker image:
   ```bash
   docker pull muga1290/habitat-hub:v1.0
   ```

### Setting Up the Environment

2. Ensure the `.env` file is correctly set up (if not already present, create it by copying the example)::
   ```bash
   cp .env.example .env
   ```
3. Open the `.env` file and configure your database connection as per your Docker setup.

### Running the Docker Container

4. Run the Docker container with the following command:
   ```bash
   - docker-compose up 
   - sudo docker-compose up queue
   ```

### Developing with VS Code

5. Open the project directory in VS Code:
   - Open VS Code.
   - Select `File > Open Folder` and choose your project directory (`HabitatHub-Server`).

6. Ensure that any changes made in VS Code are reflected in the Docker container due to the volume mapping in `docker-compose.yml`.

### Executing Artisan Commands

7. Run the necessary Artisan commands inside the Docker container:
   ```bash
   docker exec -it <container_id> php artisan migrate --seed
   docker exec -it <container_id> php artisan queue:work
   docker exec -it <container_id> php artisan websocket:serve
   ```
## Contributing

### Setting Up Docker Secrets for GitHub Actions

To contribute to the project and enable GitHub Actions to push Docker images to Docker Hub, follow these steps to set up your Docker Hub username and token as secrets:

8. **Generate a Docker Hub Access Token:**
   - Log in to Docker Hub.
   - Navigate to **Account Settings** > **Security**.
   - Click **New Access Token**, give it a name, and copy the generated token.

9. **Add the Docker Hub Username and Token as Secrets in GitHub:**
   - Go to your GitHub repository.
   - Click on **Settings**.
   - Select **Secrets and variables** > **Actions**.
   - Click **New repository secret**.
   - Add the following secrets:
     - `DOCKERHUB_USERNAME`: Your Docker Hub username.
     - `DOCKERHUB_TOKEN`: The Docker Hub access token you generated.
  


