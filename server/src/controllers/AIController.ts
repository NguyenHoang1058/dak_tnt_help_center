import { Request, Response } from 'express';
import { AIService } from '../services/AIService';

export const AIController = {
    //Xử lý chat
    chat: async (req: Request, res: Response) => {
        try{
            const {message, history} = req.body;
            const reply = await AIService.chat(message, history);

            res.json({success: true, data: reply});
        }catch (error: any){
            res.status(500).json({success: false, message: error.message});
        }
    },

    //Xử lý phân tích danh mục
    analyze: async (req: Request, res: Response) => {
        try{
            //Trong thực tế sẽ lấy data từ portfolio ở DB dựa trên req.user.id
            //Đang tạm thời nhận data từ body để test
            const {portfolio} = req.body;
            const advice = await AIService.analyzePortfolio(portfolio);

            res.json({success: true, data: advice});
        }catch (error: any){
            res.status(500).json({success: false, message: error.message});
        }
    }
};