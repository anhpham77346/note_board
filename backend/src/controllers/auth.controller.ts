import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

/**
 * Đăng ký tài khoản mới
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
      return;
    }

    const result = await authService.register(email, password, name);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'Email đã được sử dụng') {
      res.status(409).json({ message: error.message });
      return;
    }
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng ký' });
  }
};

/**
 * Đăng nhập
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
      return;
    }

    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Không tìm thấy tài khoản') {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error.message === 'Mật khẩu không chính xác') {
        res.status(401).json({ message: error.message });
        return;
      }
    }
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng nhập' });
  }
}; 