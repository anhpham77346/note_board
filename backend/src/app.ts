import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';

// Import routes
import userRoutes from './routes/user.routes';
import boardRoutes from './routes/board.routes';
import noteRoutes from './routes/note.routes';
import authRoutes from './routes/auth.routes';

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

// Routes
app.use('/api/users', userRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/auth', authRoutes);

// Root route for simple status check
app.get('/', (req, res) => {
  res.send('Note Board API is running');
});

// Board notes routes
app.use('/api/boards', noteRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
});
