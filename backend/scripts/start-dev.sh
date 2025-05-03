#!/bin/sh

echo "Waiting for MySQL to start..."
# Đợi MySQL khởi động
sleep 10

# Rebuild bcrypt to ensure compatibility with the current environment
echo "Rebuilding bcrypt..."
npm rebuild bcrypt --build-from-source

# Tạo lại Prisma client để đảm bảo tương thích với môi trường
echo "Generating Prisma client..."
npx prisma generate

# Chạy prisma migrate để cập nhật schema
echo "Running database migrations..."
npx prisma migrate dev --name init --skip-generate

# Khởi động ứng dụng
echo "Starting application..."
npm run dev 