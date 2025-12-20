console.log("Đang khởi động server...");

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import aiRoutes from './routes/ai.routes';
import financeRoutes from './routes/finance.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/ai', aiRoutes);
app.use('/api', financeRoutes);

app.get('/', (req, res) => {
    res.send('DAK.TNT server is running!');
});

app.listen(PORT, () => {
console.log(`[server]: Server is running at http://localhost:${PORT}`);
  console.log(`   Database URL: ${process.env.DATABASE_URL}`);
  console.log(`   Ollama URL: ${process.env.OLLAMA_HOST}`);
});