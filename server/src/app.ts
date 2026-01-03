import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import aiRoutes from './routes/ai.routes';
import financeRoutes from './routes/finance.routes';

console.log('Đang khởi động server...');

// Load biến môi trường
dotenv.config();

const app = express();
const PORT: number | string = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api', financeRoutes);

// Health check
app.get('/', (req: Request, res: Response) => {
  res.send('DAK.TNT server is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
  console.log(`   Database URL: ${process.env.DATABASE_URL}`);
  console.log(`   Ollama URL: ${process.env.OLLAMA_HOST}`);
});
