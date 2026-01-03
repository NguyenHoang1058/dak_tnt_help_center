import { AccountRepository } from "../repositories/AccountRepository";
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export const TradingService = {
    buyStock: async (userId: string, symbol: string, quantity: number, price: number) => {
        // 1. Lấy thông tin tài khoản
        const account = await AccountRepository.findBalanceByUserId(userId);
        if(!account) throw new Error("Tài khoản không tồn tại.");

        const totalCost = quantity * price;

        // 2. Kiểm tra số dư
        if(account.balance < totalCost){
            throw new Error("Số dư không đủ để thực hiện giao dịch");
        }

        return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // Trừ tiền
            await tx.account.update({
                where: {id: account.id},
                data: {balance: account.balance - totalCost}
            })

            // Cập nhật portfolio
            const existingPos = await tx.portfolio.findUnique({
                where: {accountId_symbol: {accountId: account.id, symbol}}
            })

            if(existingPos){
                // Tính lại giá vốn trung bình
                const newQty = existingPos.quantity + quantity;
                const newAvgPrice = ((existingPos.avgPrice * existingPos.quantity) + totalCost) / newQty;

                await tx.portfolio.update({
                    where: {id: existingPos.id},
                    data: {quantity: newQty, avgPrice: newAvgPrice}
                });
            }else{
                await tx.portfolio.create({
                    data: {accountId: account.id, symbol, quantity, avgPrice: price}
                });
            }

            // lưu lịch sử giao dịch
            return await tx.transaction.create({
                data: {
                    accountId: account.id,
                    type: "BUY",
                    symbol,
                    amount: totalCost,
                    quantity,
                    price
                }
            });
        });
    },

    getWallet: async (userId: string) => {
        return await AccountRepository.findBalanceByUserId(userId);
    }
};