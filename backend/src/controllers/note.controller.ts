import { Request, Response } from 'express';
import { NoteService, CreateNoteInput, UpdateNoteInput } from '../services/note.service';

const noteService = new NoteService();

export class NoteController {
  /**
   * Create a new note in a board
   */
  async createNote(req: Request, res: Response): Promise<void> {
    try {
      const { content } = req.body;
      const boardId = parseInt(req.params.boardId);
      const userId = (req as any).user.id;

      if (isNaN(boardId)) {
        res.status(400).json({ message: 'Invalid board ID' });
        return;
      }

      if (!content || content.trim() === '') {
        res.status(400).json({ message: 'Note content is required' });
        return;
      }

      // Check if the user has access to the board
      const hasAccess = await noteService.isUserBoardOwner(boardId, userId);
      if (!hasAccess) {
        res.status(404).json({ message: 'Board not found or access denied' });
        return;
      }

      const noteData: CreateNoteInput = {
        content,
        boardId
      };

      const newNote = await noteService.createNote(noteData);
      res.status(201).json(newNote);
    } catch (error) {
      console.error('Error creating note:', error);
      res.status(500).json({ message: 'Failed to create note' });
    }
  }

  /**
   * Get all notes for a board
   */
  async getNotesByBoardId(req: Request, res: Response): Promise<void> {
    try {
      const boardId = parseInt(req.params.boardId);
      const userId = (req as any).user.id;

      if (isNaN(boardId)) {
        res.status(400).json({ message: 'Invalid board ID' });
        return;
      }

      // Check if the user has access to the board
      const hasAccess = await noteService.isUserBoardOwner(boardId, userId);
      if (!hasAccess) {
        res.status(404).json({ message: 'Board not found or access denied' });
        return;
      }

      const notes = await noteService.getNotesByBoardId(boardId);
      res.status(200).json(notes);
    } catch (error) {
      console.error('Error getting notes:', error);
      res.status(500).json({ message: 'Failed to get notes' });
    }
  }

  /**
   * Get a note by ID
   */
  async getNoteById(req: Request, res: Response): Promise<void> {
    try {
      const noteId = parseInt(req.params.id);
      const userId = (req as any).user.id;

      if (isNaN(noteId)) {
        res.status(400).json({ message: 'Invalid note ID' });
        return;
      }

      // Check if the user has access to the note
      const hasAccess = await noteService.isUserNoteOwner(noteId, userId);
      if (!hasAccess) {
        res.status(404).json({ message: 'Note not found or access denied' });
        return;
      }

      const note = await noteService.getNoteById(noteId);
      if (!note) {
        res.status(404).json({ message: 'Note not found' });
        return;
      }

      res.status(200).json(note);
    } catch (error) {
      console.error('Error getting note:', error);
      res.status(500).json({ message: 'Failed to get note' });
    }
  }

  /**
   * Update a note
   */
  async updateNote(req: Request, res: Response): Promise<void> {
    try {
      const noteId = parseInt(req.params.id);
      const userId = (req as any).user.id;
      const { content } = req.body;

      if (isNaN(noteId)) {
        res.status(400).json({ message: 'Invalid note ID' });
        return;
      }

      if (!content || content.trim() === '') {
        res.status(400).json({ message: 'Note content is required' });
        return;
      }

      // Check if the user has access to the note
      const hasAccess = await noteService.isUserNoteOwner(noteId, userId);
      if (!hasAccess) {
        res.status(404).json({ message: 'Note not found or access denied' });
        return;
      }

      const noteData: UpdateNoteInput = {
        content
      };

      const updatedNote = await noteService.updateNote(noteId, noteData);
      res.status(200).json(updatedNote);
    } catch (error) {
      console.error('Error updating note:', error);
      res.status(500).json({ message: 'Failed to update note' });
    }
  }

  /**
   * Delete a note
   */
  async deleteNote(req: Request, res: Response): Promise<void> {
    try {
      const noteId = parseInt(req.params.id);
      const userId = (req as any).user.id;

      if (isNaN(noteId)) {
        res.status(400).json({ message: 'Invalid note ID' });
        return;
      }

      // Check if the user has access to the note
      const hasAccess = await noteService.isUserNoteOwner(noteId, userId);
      if (!hasAccess) {
        res.status(404).json({ message: 'Note not found or access denied' });
        return;
      }

      await noteService.deleteNote(noteId);
      res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
      console.error('Error deleting note:', error);
      res.status(500).json({ message: 'Failed to delete note' });
    }
  }
} 