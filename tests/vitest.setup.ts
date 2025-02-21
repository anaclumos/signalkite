import { auth } from "@clerk/nextjs/server"
import { PrismaClient } from "@prisma/client"
import * as matchers from "@testing-library/jest-dom/matchers"
import "@testing-library/jest-dom/vitest"
import { expect, vi } from "vitest"
import { DeepMockProxy, mockDeep } from "vitest-mock-extended"

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

vi.mock("@clerk/nextjs", () => ({
  auth: () =>
    Promise.resolve({
      userId: "test-user-id",
    }),
  currentUser: () =>
    Promise.resolve({
      id: "test-user-id",
    }),
  clerkClient: {
    users: {
      getUser: () => Promise.resolve({ id: "test-user-id" }),
    },
  },
}))

export type Context = {
  db: PrismaClient
}

export type MockContext = {
  db: DeepMockProxy<PrismaClient>
}

export const mockCtx: MockContext = {
  db: mockDeep<PrismaClient>(),
}

export const mockAuth = (userId: string | null = null) => {
  vi.mocked(auth).mockImplementation(() =>
    Promise.resolve({
      userId: null,
      sessionClaims: null,
      sessionId: null,
      actor: null,
      orgId: null,
      orgRole: null,
      orgSlug: null,
      getToken: async () => null,
      has: () => false,
      redirectToSignIn: () => Promise.resolve() as never,
      orgPermissions: null,
      factorVerificationAge: null,
      debug: () => ({}),
    }),
  )
}

// Helper for Prisma errors
export const createPrismaError = (code: string, message: string) => {
  const error = new Error(message) as Error & { code: string }
  error.code = code
  return error
}

expect.extend(matchers)
