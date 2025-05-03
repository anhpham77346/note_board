import express from 'express';
import { NoteController } from '../controllers/note.controller';

const router = express.Router();
const noteController = new NoteController();

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Note management
 */

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get note by ID
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Note not found
 */
router.get('/:id', (req, res) => noteController.getNoteById(req, res));

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Note ID
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
 *       200:
 *         description: Note updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Note not found
 */
router.put('/:id', (req, res) => noteController.updateNote(req, res));

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Note not found
 */
router.delete('/:id', (req, res) => noteController.deleteNote(req, res));

export default router; 