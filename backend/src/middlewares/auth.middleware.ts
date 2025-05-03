import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mở rộng định nghĩa Request để thêm user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Không tìm thấy token xác thực' });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    
    // Kiểm tra xem user có tồn tại không
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      res.status(401).json({ message: 'Người dùng không tồn tại' });
      return;
    }

    // Gán thông tin user vào request
    req.user = { id: user.id, email: user.email };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token không hợp lệ' });
    return;
  }
};

// Middleware khi cần quyền admin nếu cần mở rộng sau này
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  // Logic kiểm tra quyền admin nếu cần
  next();
}; 