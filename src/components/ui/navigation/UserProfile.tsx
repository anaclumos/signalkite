import { Button } from "@/components/Button"
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"

export function UserProfile() {
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
    </>
  )
}
