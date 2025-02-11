"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"

export const UserProfileLoading = () => {
  return (
    <div className="flex justify-center items-center h-9">
      <Skeleton className="w-full h-full" />
    </div>
  )
}

export function UserProfile() {
  const { resolvedTheme } = useTheme()
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return <UserProfileLoading />
  }

  return (
    <>
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
          className="flex items-center justify-start gap-4 px-3 py-2 rounded-lg"
        >
          <UserButton
            appearance={{
              baseTheme: resolvedTheme === "dark" ? dark : undefined,
            }}
            fallback={<Skeleton className="w-7 h-7 rounded-full" />}
          />
          <span className="font-medium">{user?.fullName ?? "User"}</span>
        </Button>
      </SignedIn>
    </>
  )
}
