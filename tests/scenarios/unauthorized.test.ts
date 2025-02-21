import { expect, test } from "@playwright/test"

test.describe("unauthenticated routes", () => {
  test("shows not authorized when accessing prompts", async ({ page }) => {
    await page.goto("/prompts")
    await expect(page.getByText("not authorized")).toBeVisible()
  })

  test("shows not authorized when accessing schedules", async ({ page }) => {
    await page.goto("/schedules")
    await expect(page.getByText("not authorized")).toBeVisible()
  })
})
