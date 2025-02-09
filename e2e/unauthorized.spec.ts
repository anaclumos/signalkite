import { expect, test } from "@playwright/test"

test.describe("unauthenticated routes", () => {
  test("returns 401 when accessing prompts", async ({ page }) => {
    const response = await page.goto("/prompts")
    expect(response?.status()).toBe(401)
  })

  test("returns 401 when accessing schedules", async ({ page }) => {
    const response = await page.goto("/schedules")
    expect(response?.status()).toBe(401)
  })

  // Fail on purpose
  test("returns 401 when accessing archives", async ({ page }) => {
    const response = await page.goto("/archives")
    expect(response?.status()).toBe(401)
  })
})
