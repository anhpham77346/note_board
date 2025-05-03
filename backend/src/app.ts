import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';

// Import routes
import userRoutes from './routes/user.routes';
import boardRoutes from './routes/board.routes';
import noteRoutes from './routes/note.routes';
import boardNotesRoutes from './routes/board-notes.routes';
import authRoutes from './routes/auth.routes';

// Import middlewares
import { authenticate } from './middlewares/auth.middleware';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// Public routes (không cần xác thực)
app.use('/api/auth', authRoutes);

// Root route for simple status check
app.get('/', (req, res) => {
  res.send('Note Board API is running');
});

// Protected routes (cần xác thực)
app.use('/api/users', authenticate, userRoutes);
app.use('/api/boards', authenticate, boardRoutes);
app.use('/api/notes', authenticate, noteRoutes);

// Board notes routes (routes for notes that are part of a board)
app.use('/api/boards', authenticate, boardNotesRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Đã xảy ra lỗi server' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
});
