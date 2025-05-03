import { Request, Response } from 'express';
import { BoardService, CreateBoardInput, UpdateBoardInput } from '../services/board.service';

const boardService = new BoardService();

export class BoardController {
  /**
   * Create a new board
   */
  async createBoard(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      const userId = (req as any).user.id;

      if (!name || name.trim() === '') {
        res.status(400).json({ message: 'Board name is required' });
        return;
      }

      const boardData: CreateBoardInput = {
        name,
        userId,
      };

      const newBoard = await boardService.createBoard(boardData);
      res.status(201).json(newBoard);
    } catch (error) {
      console.error('Error creating board:', error);
      res.status(500).json({ message: 'Failed to create board' });
    }
  }

  /**
   * Get all boards for the authenticated user
   */
  async getAllBoards(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const boards = await boardService.getBoardsByUserId(userId);
      res.status(200).json(boards);
    } catch (error) {
      console.error('Error getting boards:', error);
      res.status(500).json({ message: 'Failed to get boards' });
    }
  }

  /**
   * Get a board by ID
   */
  async getBoardById(req: Request, res: Response): Promise<void> {
    try {
      const boardId = parseInt(req.params.id);
      const userId = (req as any).user.id;

      if (isNaN(boardId)) {
        res.status(400).json({ message: 'Invalid board ID' });
        return;
      }

      const board = await boardService.getBoardById(boardId, userId);

      if (!board) {
        res.status(404).json({ message: 'Board not found' });
        return;
      }

      res.status(200).json(board);
    } catch (error) {
      console.error('Error getting board:', error);
      res.status(500).json({ message: 'Failed to get board' });
    }
  }

  /**
   * Update a board
   */
  async updateBoard(req: Request, res: Response): Promise<void> {
    try {
      const boardId = parseInt(req.params.id);
      const userId = (req as any).user.id;
      const { name } = req.body;

      if (isNaN(boardId)) {
        res.status(400).json({ message: 'Invalid board ID' });
        return;
      }

      if (!name || name.trim() === '') {
        res.status(400).json({ message: 'Board name is required' });
        return;
      }

      const boardData: UpdateBoardInput = {
        name,
      };

      const updatedBoard = await boardService.updateBoard(boardId, userId, boardData);

      if (!updatedBoard) {
        res.status(404).json({ message: 'Board not found' });
        return;
      }

      res.status(200).json(updatedBoard);
    } catch (error) {
      console.error('Error updating board:', error);
      res.status(500).json({ message: 'Failed to update board' });
    }
  }

  /**
   * Delete a board
   */
  async deleteBoard(req: Request, res: Response): Promise<void> {
    try {
      const boardId = parseInt(req.params.id);
      const userId = (req as any).user.id;

      if (isNaN(boardId)) {
        res.status(400).json({ message: 'Invalid board ID' });
        return;
      }

      const deletedBoard = await boardService.deleteBoard(boardId, userId);

      if (!deletedBoard) {
        res.status(404).json({ message: 'Board not found' });
        return;
      }

      res.status(200).json({ message: 'Board deleted successfully' });
    } catch (error) {
      console.error('Error deleting board:', error);
      res.status(500).json({ message: 'Failed to delete board' });
    }
  }
} 