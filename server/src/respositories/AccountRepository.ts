import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const AccountRepository = {
    findBalanceByUserId: async (userId: string) => {
        return await prisma.account.findUnique({
            where: {userId},
            include: {portfolio: true, transactions: true}  
        });
    },

    updateBalance: async (accountId: string, newBalance: number) => {
        return await prisma.account.update({
            where: {id: accountId},
            data: {balance: newBalance}
        });
    }
};