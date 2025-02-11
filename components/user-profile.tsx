"use client"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useClerk,
} from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"
import { Suspense } from "react"

export const UserProfileLoading = () => {
  return (
    <div className="flex justify-center items-center h-9">
      <Spinner className="w-full" />
    </div>
  )
}

export function UserProfile() {
  const { resolvedTheme } = useTheme()
  const { openUserProfile, user } = useClerk()

  return (
    <Suspense fallback={<UserProfileLoading />}>
      <ClerkLoading>
        <UserProfileLoading />
      </ClerkLoading>
      <ClerkLoaded>
        <SignedOut>
          <div className="flex gap-2">
            <SignInButton>
              <Button variant="secondary" className="flex-1">
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className="flex-1">Sign up</Button>
            </SignUpButton>
          </div>
        </SignedOut>
        <SignedIn>
          <Button
            variant="ghost"
            onClick={() => openUserProfile()}
            className="flex items-center justify-start gap-4 px-3 py-2 rounded-lg"
          >
            <UserButton
              appearance={{
                baseTheme: resolvedTheme === "dark" ? dark : undefined,
              }}
              fallback={<UserProfileLoading />}
            />
            <span className="font-medium">
              {user?.fullName ?? "User profile"}
            </span>
          </Button>
        </SignedIn>
      </ClerkLoaded>
    </Suspense>
  )
}
