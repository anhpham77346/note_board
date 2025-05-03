import { Secret } from 'jsonwebtoken';

// Sử dụng biến môi trường, hoặc một secret mặc định (chỉ cho dev)
export const JWT_SECRET: Secret = process.env.JWT_SECRET || 'note_board_jwt_secret_key_dev_only';

// Không đặt thời hạn cho token
export const JWT_OPTIONS = {
  // Không đặt expiresIn để token không bao giờ hết hạn
}; 