#!/bin/sh

echo "Waiting for MySQL to start..."
# Wait for MySQL to be ready - simple timeout approach
sleep 15

# Clean node_modules/bcrypt and reinstall it
echo "Fixing bcrypt issue..."
rm -rf /app/node_modules/bcrypt
npm install --save bcrypt

# Rebuild bcrypt to ensure compatibility with the current environment
echo "Rebuilding bcrypt..."
npm rebuild bcrypt --build-from-source

# Tạo lại Prisma client để đảm bảo tương thích với môi trường
echo "Generating Prisma client..."
npx prisma generate

# Chạy prisma migrate để cập nhật schema
echo "Running database migrations..."
npx prisma migrate dev --name init --skip-generate

# Enable file system polling for better file change detection in Docker
export CHOKIDAR_USEPOLLING=true
export WATCHPACK_POLLING=true
export NODEMON_LEGACY_WATCH=true

# Khởi động ứng dụng
echo "Starting application with hot reloading..."
npm run dev 