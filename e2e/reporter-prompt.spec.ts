import { expect, test } from "@playwright/test"
import { mockClerkUser } from "./utils/mock-clerk"

test.beforeEach(async ({ page }) => {
  await mockClerkUser(page, {
    id: "test_user",
    emailAddresses: [
      {
        id: "test_email_id",
        emailAddress: "test@example.com",
      },
    ],
    primaryEmailAddressId: "test_email_id",
  })
})

test("can create a reporter with a prompt", async ({ page }) => {
  // First create a prompt
  await page.goto("/prompts/new")
  await page.getByLabel("Name").fill("Test Prompt")
  await page.getByLabel("Text").fill("Test prompt text")
  await page.getByRole("button", { name: "Create Prompt" }).click()
  await expect(page).toHaveURL("/prompts")

  // Then create a reporter with the prompt
  await page.goto("/reporters/new")
  await page.getByLabel("Name").fill("Reporter with Prompt")
  await page.getByLabel("Description").fill("Testing prompt integration")
  await page.getByRole("combobox", { name: "Prompt" }).click()
  await page.getByRole("option", { name: "Test Prompt" }).click()
  await page.getByRole("button", { name: "Create Reporter" }).click()

  // Verify we're redirected to the reporters list
  await expect(page).toHaveURL("/reporters")

  // Verify the reporter was created with the prompt
  const reporterRow = page.getByRole("row", { name: "Reporter with Prompt" })
  await expect(reporterRow).toBeVisible()
  await expect(reporterRow).toContainText("Test Prompt")
})
