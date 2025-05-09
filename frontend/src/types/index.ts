export interface Note {
  id: string;
  content: string;
  boardId: string;
}

export interface Board {
  id: string;
  title: string;
  notes: Note[];
} 