import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const isTest = process.env.NODE_ENV === "test"

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isTest ? [] : ["query", "info", "warn", "error"],
    errorFormat: isTest ? "minimal" : "pretty",
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
