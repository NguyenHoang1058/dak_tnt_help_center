import {Request, Response} from 'express';
import { TradingService } from '../services/TradingService';
import { waitForDebugger } from 'inspector';
import { AccountRepository } from '../respositories/AccountRepository';

export const TradingController = {
    buy: async (req: Request, res: Response) => {
        try {
            const {symbol, quantity, price} = req.body;
            const userId = req.body.userId; //Chỉnh sửa sau để lấy từ JWT

            const result = await TradingService.buyStock(userId, symbol, quantity, price);
            res.json({success: true, data: result});
        }catch(error: any){
            res.status(400).json({success: false, message: error.message});
        }
    },

    getWallet: async (req: Request, res: Response) => {
        try{
            //Trong thực tế userId lấy từ req.user.id sau khi đã xác thực
            //Tạm thời lấy từ query để test
            const userId = (req.query.userId as string) || "user-id-mac-dinh";
            const account = await AccountRepository.findBalanceByUserId(userId);

            if(!account){
                res.status(404).json({success: false, message: "Tài khoản không tồn tại"});
                return;
            }

            res.json({
                success: true,
                data: {
                    balance: account.balance,
                    transactions: account.transactions || [],
                    portfolio: account.portfolio || []
                }
            });

        }catch (error: any){
            res.status(500).json({success: false, message: error.message});
        }
    }
};