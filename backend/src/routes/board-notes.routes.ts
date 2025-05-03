import express from 'express';
import { NoteController } from '../controllers/note.controller';

const router = express.Router();
const noteController = new NoteController();

/**
 * @swagger
 * /api/boards/{boardId}/notes:
 *   post:
 *     summary: Create a new note in a board
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Board ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Note content
 *     responses:
 *       201:
 *         description: Note created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Board not found
 */
router.post('/:boardId/notes', (req, res) => noteController.createNote(req, res));

/**
 * @swagger
 * /api/boards/{boardId}/notes:
 *   get:
 *     summary: Get all notes for a board
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Board ID
 *     responses:
 *       200:
 *         description: List of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   boardId:
 *                     type: integer
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Board not found
 */
router.get('/:boardId/notes', (req, res) => noteController.getNotesByBoardId(req, res));

export default router; 