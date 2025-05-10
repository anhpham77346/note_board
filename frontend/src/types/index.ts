export interface Note {
  id: string | number;
  content: string;
  boardId: string | number;
  createdAt?: string;
  isTemporary?: boolean;
}

export interface Board {
  id: string | number;
  title: string;
  name?: string; // Để tương thích với backend API
  notes: Note[];
  createdAt?: string;
} 