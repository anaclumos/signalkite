import { expect, test } from "@playwright/test"

test("home page is accessible and has heading", async ({ page }) => {
  await page.goto("./")

  // Check that page is accessible
  const title = await page.title()
  expect(title).toBeTruthy()

  // Check for h1 heading
  const heading = await page.locator("h1")
  await expect(heading).toBeVisible()
  await expect(heading).toHaveText("every.news")
})
