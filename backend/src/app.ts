import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

// Import routes
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

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3001'], // Frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// Endpoint to get OpenAPI JSON
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// Endpoint to save API documentation as JSON file
app.get('/save-api-docs', (req, res) => {
  try {
    // Create directory if it doesn't exist
    const docsDir = path.join(__dirname, '..', 'docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    
    // Save to file with timestamp
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const fileName = `api-docs-${timestamp}.json`;
    const filePath = path.join(docsDir, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(specs, null, 2));
    
    res.json({ 
      success: true,
      message: 'API documentation saved successfully',
      filePath: filePath,
      fileName: fileName
    });
  } catch (error) {
    console.error('Error saving API documentation:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to save API documentation',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// Public routes (không cần xác thực)
app.use('/api/auth', authRoutes);

// Root route for simple status check
app.get('/', (req, res) => {
  res.send('Note Board API is running');
});

// Protected routes (cần xác thực)
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
  console.log(`OpenAPI JSON available at http://localhost:${port}/swagger.json`);
  console.log(`Save API documentation at http://localhost:${port}/save-api-docs`);
});
