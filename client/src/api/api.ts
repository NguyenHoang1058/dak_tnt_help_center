import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Server on 3000
})

export const tradeApi = {
    buyStock: (data: {userId: string, symbol: string, quantity: number, price: number}) =>
        api.post('/trade/buy', data),
    getWallet: () => api.get('/wallet'),
};

export const aiApi = {
    getAdvice: (portfolio: any) => api.post('/ai/analyze', { portfolio }),
    chat: (message: string, history: any[]) => api.post('/ai/chat', { message, history }),
};