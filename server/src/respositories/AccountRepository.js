"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.AccountRepository = {
    findBalanceByUserId: async (userId) => {
        return await prisma.account.findUnique({
            where: { userId },
            include: { portfolio: true, transactions: true }
        });
    },
    updateBalance: async (accountId, newBalance) => {
        return await prisma.account.update({
            where: { id: accountId },
            data: { balance: newBalance }
        });
    }
};
