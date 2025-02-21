import { expect, test } from "@playwright/test"

test.describe("authenticated routes", () => {
  test("access dashboard when signed in", async ({ page }) => {
    const response = await page.goto("/dashboard")
    expect(response?.status()).toBe(200)
  })

  test("access reporters when signed in", async ({ page }) => {
    const response = await page.goto("/reporters")
    expect(response?.status()).toBe(200)
  })

  test("access marketplace when signed in", async ({ page }) => {
    const response = await page.goto("/marketplace")
    expect(response?.status()).toBe(200)
  })
})
