#!/bin/bash

echo "Starting Docker entrypoint script..."

# Fix line endings for all shell scripts
find /app/scripts -type f -name "*.sh" -exec dos2unix {} \;
echo "Line endings fixed for shell scripts"

# Wait for MySQL to start
echo "Waiting for MySQL to start..."
sleep 15

# Clean and reinstall bcrypt
echo "Fixing bcrypt issue..."
rm -rf /app/node_modules/bcrypt
npm install --save bcrypt
npm rebuild bcrypt --build-from-source

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "Running database migrations..."
npx prisma migrate dev --name init --skip-generate

# Enable file system polling for better file change detection in Docker
export CHOKIDAR_USEPOLLING=true
export WATCHPACK_POLLING=true
export NODEMON_LEGACY_WATCH=true

# Start the application
echo "Starting application with hot reloading..."
npm run dev 