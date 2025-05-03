import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_OPTIONS } from '../config/jwt';

const prisma = new PrismaClient();

// Interface User định nghĩa lại để đảm bảo tương thích
interface User {
  id: number;
  email: string;
  password: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Đăng ký tài khoản mới
 */
export const register = async (email: string, password: string, name?: string) => {
  try {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('Email đã được sử dụng');
    }

    // Hash mật khẩu
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Tạo user mới
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
    });

    // Tạo JWT token (vô thời hạn)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      JWT_OPTIONS
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

/**
 * Đăng nhập
 */
export const login = async (email: string, password: string) => {
  // Tìm user bằng email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Không tìm thấy tài khoản');
  }

  // Kiểm tra mật khẩu
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Mật khẩu không chính xác');
  }

  // Tạo JWT token (vô thời hạn)
  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    JWT_OPTIONS
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    token,
  };
}; 