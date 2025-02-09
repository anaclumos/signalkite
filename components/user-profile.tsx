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
import { Suspense } from "react"

export const UserProfileLoading = () => {
  return (
    <div className="flex justify-center items-center h-9">
      <Spinner className="w-full" />
    </div>
  )
}

export function UserProfile() {
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
              elements: {
                userButtonBox: "flex flex-row-reverse justify-end p-2 w-full",
                userButtonTrigger: "w-full",
                rootBox: "w-full",
              },
            }}
          />
        </SignedIn>
      </ClerkLoaded>
    </Suspense>
  )
}
