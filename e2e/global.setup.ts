import path from "path"
import { fileURLToPath } from "url"
import { clerk, clerkSetup } from "@clerk/testing/playwright"
import { test as setup } from "@playwright/test"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

setup("global setup", async ({}) => {
  await clerkSetup()

  if (
    !process.env.E2E_CLERK_USER_USERNAME ||
    !process.env.E2E_CLERK_USER_PASSWORD
  ) {
    throw new Error(
      "Please provide E2E_CLERK_USER_USERNAME and E2E_CLERK_USER_PASSWORD environment variables.",
    )
  }
})

const authFile = path.join(__dirname, "../playwright/.clerk/user.json")

setup("authenticate", async ({ page }) => {
  await page.goto("/")
  await clerk.signIn({
    page,
    signInParams: {
      strategy: "password",
      identifier: process.env.E2E_CLERK_USER_USERNAME!,
      password: process.env.E2E_CLERK_USER_PASSWORD!,
    },
  })
  await page.goto("/dashboard")
  await page.waitForSelector("h1:has-text('Dashboard')")

  await page.context().storageState({ path: authFile })
})
