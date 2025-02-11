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
          <UserButton
            showName
            appearance={{
              baseTheme: resolvedTheme === "dark" ? dark : undefined,
              elements: {
                userButtonBox: "flex flex-row-reverse justify-end p-2 w-full",
                userButtonTrigger: "w-full",
                rootBox: "w-full",
              },
            }}
            fallback={<UserProfileLoading />}
          />
        </SignedIn>
      </ClerkLoaded>
    </Suspense>
  )
}
