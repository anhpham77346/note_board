import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Tạo instance axios với các cấu hình mặc định
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để gắn token vào header nếu user đã đăng nhập
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interface cho dữ liệu API
export interface ApiBoard {
  id: number;
  name: string;
  createdAt: string;
}

export interface ApiNote {
  id: number;
  content: string;
  createdAt: string;
  boardId: number;
}

// API Board
export const boardsApi = {
  // Lấy tất cả boards
  getAll: async (): Promise<ApiBoard[]> => {
    const response = await api.get('/api/boards');
    return response.data;
  },

  // Lấy board theo id
  getById: async (id: number): Promise<ApiBoard> => {
    const response = await api.get(`/api/boards/${id}`);
    return response.data;
  },

  // Tạo board mới
  create: async (name: string): Promise<ApiBoard> => {
    const response = await api.post('/api/boards', { name });
    return response.data;
  },

  // Cập nhật board
  update: async (id: number, name: string): Promise<ApiBoard> => {
    const response = await api.put(`/api/boards/${id}`, { name });
    return response.data;
  },

  // Xóa board
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/boards/${id}`);
  }
};

// API Note
export const notesApi = {
  // Lấy tất cả notes của một board
  getByBoardId: async (boardId: number): Promise<ApiNote[]> => {
    const response = await api.get(`/api/boards/${boardId}/notes`);
    return response.data;
  },

  // Lấy note theo id
  getById: async (id: number): Promise<ApiNote> => {
    const response = await api.get(`/api/notes/${id}`);
    return response.data;
  },

  // Tạo note mới trong board
  create: async (boardId: number, content: string): Promise<ApiNote> => {
    const response = await api.post(`/api/boards/${boardId}/notes`, { content });
    return response.data;
  },

  // Cập nhật note
  update: async (id: number, content: string): Promise<ApiNote> => {
    const response = await api.put(`/api/notes/${id}`, { content });
    return response.data;
  },

  // Xóa note
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/notes/${id}`);
  }
};

export default api; 