import { PrismaClient, Board } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateBoardInput {
  name: string;
  userId: number;
}

export interface UpdateBoardInput {
  name: string;
}

export class BoardService {
  /**
   * Create a new board
   */
  async createBoard(data: CreateBoardInput): Promise<Board> {
    return prisma.board.create({
      data: {
        name: data.name,
        userId: data.userId,
      },
    });
  }

  /**
   * Get all boards for a specific user
   */
  async getBoardsByUserId(userId: number): Promise<Board[]> {
    return prisma.board.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get a board by ID
   */
  async getBoardById(id: number, userId: number): Promise<Board | null> {
    return prisma.board.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        notes: true,
      },
    });
  }

  /**
   * Update a board
   */
  async updateBoard(id: number, userId: number, data: UpdateBoardInput): Promise<Board | null> {
    // First check if the board exists and belongs to the user
    const board = await prisma.board.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!board) {
      return null;
    }

    return prisma.board.update({
      where: {
        id,
      },
      data: {
        name: data.name,
      },
    });
  }

  /**
   * Delete a board
   */
  async deleteBoard(id: number, userId: number): Promise<Board | null> {
    // First check if the board exists and belongs to the user
    const board = await prisma.board.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!board) {
      return null;
    }

    return prisma.board.delete({
      where: {
        id,
      },
    });
  }
} 