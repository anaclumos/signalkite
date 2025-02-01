import Prisma from "@prisma/client"

const globalForPrisma = global as unknown as { prisma: Prisma.PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
