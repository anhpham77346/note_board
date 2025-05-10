import { PrismaClient, Note } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateNoteInput {
  content: string;
  boardId: number;
}

export interface UpdateNoteInput {
  content: string;
  boardId?: number;
}

export interface MoveNoteInput {
  boardId: number;
}

export class NoteService {
  /**
   * Create a new note
   */
  async createNote(data: CreateNoteInput): Promise<Note> {
    return prisma.note.create({
      data: {
        content: data.content,
        boardId: data.boardId
      }
    });
  }

  /**
   * Get all notes for a specific board
   */
  async getNotesByBoardId(boardId: number): Promise<Note[]> {
    return prisma.note.findMany({
      where: {
        boardId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Get a note by ID
   */
  async getNoteById(id: number): Promise<Note | null> {
    return prisma.note.findUnique({
      where: {
        id
      }
    });
  }

  /**
   * Check if a user has access to a note (through board ownership)
   */
  async isUserNoteOwner(noteId: number, userId: number): Promise<boolean> {
    const note = await prisma.note.findUnique({
      where: {
        id: noteId
      },
      include: {
        board: true
      }
    });

    if (!note) {
      return false;
    }

    return note.board.userId === userId;
  }

  /**
   * Check if a user has access to a board
   */
  async isUserBoardOwner(boardId: number, userId: number): Promise<boolean> {
    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        userId
      }
    });

    return !!board;
  }

  /**
   * Update a note
   */
  async updateNote(id: number, data: UpdateNoteInput): Promise<Note | null> {
    return prisma.note.update({
      where: {
        id
      },
      data: {
        content: data.content,
        ...(data.boardId !== undefined && { boardId: data.boardId })
      }
    });
  }

  /**
   * Move a note to another board
   */
  async moveNote(id: number, data: MoveNoteInput): Promise<Note | null> {
    return prisma.note.update({
      where: {
        id
      },
      data: {
        boardId: data.boardId
      }
    });
  }

  /**
   * Delete a note
   */
  async deleteNote(id: number): Promise<Note | null> {
    return prisma.note.delete({
      where: {
        id
      }
    });
  }
} 