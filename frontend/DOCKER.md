# Docker Configuration for Frontend

This document outlines how to use Docker with the frontend application.

## Development Environment

To start the frontend in development mode with Docker:

```bash
# From project root
docker-compose -f docker-compose.dev.yml up frontend
```

This will:
- Build the frontend container using Dockerfile.dev
- Mount your local code as a volume for hot reloading
- Start the application in development mode on port 3001
- Connect to the backend service automatically

## Production Environment

To start the frontend in production mode:

```bash
# From project root
docker-compose up frontend
```

This will:
- Build the frontend container using the production Dockerfile
- Build the Next.js application in production mode
- Start the application on port 3001

## Environment Variables

The following environment variables are configured:

- `NODE_ENV`: Set to either "development" or "production"
- `NEXT_PUBLIC_API_URL`: Points to the backend API service

## Accessing the Application

- Development: http://localhost:3001
- Production: http://localhost:3001

## Customizing Ports

If you need to change the port mapping, modify the `ports` section in the docker-compose files:

```yaml
ports:
  - "YOUR_DESIRED_PORT:3001"
``` 