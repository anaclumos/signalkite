import { Button } from "@/components/Button"
import { Spinner } from "@/components/Spinner"
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
    <div className="flex justify-center items-center h-full">
      <Spinner className="w-full my-2.5" />
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
