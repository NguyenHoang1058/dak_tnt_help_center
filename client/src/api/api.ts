import axios from 'axios';
import { AIController } from '../../../server/src/controllers/AIController';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Server on 3000
})

export const tradeApi = {
    buyStock: (data: {userId: string, symbol: string, quantity: number, price: number}) =>
        api.post('/trade/buy', data),
    getWallet: () => api.get('/wallet'),
};

export const aiAi = {
    getAdvice: () => api.post('/ai/analyze'),
};

api.post('/api/ai/chat', AIController.chat);
api.post('/api/ai/analyze', AIController.analyze)