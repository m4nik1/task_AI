import { PrismaClient } from '../../generated/prisma'
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"

const prisma = new PrismaClient();
export const auth = betterAuth({
    cors: {
        origin: [
            "http://localhost:3000",
            "https://taskcalibur-vector-sand.vercel.app/"
        ]
    },
    database: prismaAdapter(prisma, {
        provider: 'postgresql'
    }),
    emailAndPassword: {
        enabled: true,
    },
})