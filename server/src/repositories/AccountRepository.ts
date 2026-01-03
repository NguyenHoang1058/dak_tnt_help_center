import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const AccountRepository = {
    findBalanceByUserId: async (userId: string) => {
        return await prisma.account.findUnique({
            where: { userId },
            include: {
                transactions: true,
                portfolio: true
            }
        });
    }
};