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
    <div className="flex justify-center items-center h-13 w-full">
      <Skeleton className="w-full h-full bg-gray-200 dark:bg-gray-800" />
    </div>
  )
}

export function UserProfile() {
  const { resolvedTheme } = useTheme()
  const { isLoaded } = useUser()

  if (!isLoaded) {
    return <UserProfileLoading />
  }

  return (
    <>
      <SignedOut>
        <div className="flex gap-2">
          <SignInButton mode="modal">
            <Button variant="secondary" className="flex-1">
              Sign in
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button className="flex-1">Sign up</Button>
          </SignUpButton>
        </div>
      </SignedOut>
      <SignedIn>
        <UserButton
          appearance={{
            baseTheme: resolvedTheme === "dark" ? dark : undefined,
            elements: {
              rootBox: "!w-full",
              userButtonTrigger: "!w-full",
              userButtonBox: "!w-full !flex-row-reverse !justify-end p-3",
              userButtonOuterIdentifier: "font-medium !text-sm",
            },
          }}
          fallback={<Skeleton className="w-7 h-7 rounded-full" />}
          showName={true}
        />
      </SignedIn>
    </>
  )
}
