import { expect, test } from "@playwright/test"

test.describe("Prompts", () => {
  test.beforeEach(async ({ page }) => {
    // Go to prompts page
    await page.goto("/prompts")
  })

  test("should navigate to individual prompt page", async ({ page }) => {
    // Click first prompt in the grid
    await page.click("a[href^='/prompts/']")

    // Verify we're on a prompt page
    await expect(page).toHaveURL(/\/prompts\/[\w-]+/)

    // Verify form elements are present
    await expect(page.getByLabel("Description")).toBeVisible()
    await expect(page.getByLabel("Prompt Text")).toBeVisible()
  })

  test("should handle non-existent prompt", async ({ page }) => {
    // Try to access non-existent prompt
    await page.goto("/prompts/non-existent-id")

    // Should show error message
    await expect(page.getByText("Prompt not found")).toBeVisible()
  })

  test("should edit prompt", async ({ page }) => {
    // Go to first prompt
    await page.click("a[href^='/prompts/']")

    // Edit description
    await page.getByLabel("Description").fill("Updated Description")

    // Edit text
    await page.getByLabel("Prompt Text").fill("Updated prompt text")

    // Save changes
    await page.getByRole("button", { name: "Save Changes" }).click()

    // Should redirect back to prompts page
    await expect(page).toHaveURL("/prompts")

    // Updated description should be visible
    await expect(page.getByText("Updated Description")).toBeVisible()
  })
})
