import { expect, test } from "@playwright/test"

test.describe("Notification Channels", () => {
  test.beforeEach(async ({ page }) => {
    // Go to notification channels page
    await page.goto("/notification-channels")
  })

  test("should navigate to individual channel page", async ({ page }) => {
    // Click first channel in the grid
    await page.click("a[href^='/notification-channels/']")

    // Verify we're on a channel page
    await expect(page).toHaveURL(/\/notification-channels\/[\w-]+/)

    // Verify form elements are present
    await expect(page.getByLabel("Name")).toBeVisible()
    await expect(page.getByLabel("Type")).toBeVisible()
    await expect(page.getByLabel("Settings")).toBeVisible()
  })

  test("should handle non-existent channel", async ({ page }) => {
    // Try to access non-existent channel
    await page.goto("/notification-channels/non-existent-id")

    // Should show error message
    await expect(page.getByText("Channel not found")).toBeVisible()
  })

  test("should create new notification channel", async ({ page }) => {
    // Go to new channel page
    await page.goto("/notification-channels/new")

    // Fill out form
    await page.getByLabel("Name").fill("Test Email Channel")
    await page.getByRole("combobox").click()
    await page.getByRole("option", { name: "Email" }).click()
    await page.getByLabel("Settings").fill(
      JSON.stringify(
        {
          smtp_server: "smtp.test.com",
          port: 587,
          username: "test@example.com",
        },
        null,
        2,
      ),
    )

    // Create channel
    await page.getByRole("button", { name: "Create Channel" }).click()

    // Should redirect back to channels page
    await expect(page).toHaveURL("/notification-channels")

    // New channel should be visible
    await expect(page.getByText("Test Email Channel")).toBeVisible()
  })

  test("should edit notification channel", async ({ page }) => {
    // Go to first channel
    await page.click("a[href^='/notification-channels/']")

    // Edit name
    await page.getByLabel("Name").fill("Updated Channel Name")

    // Edit settings
    await page.getByLabel("Settings").fill(
      JSON.stringify(
        {
          smtp_server: "smtp.updated.com",
          port: 587,
          username: "updated@example.com",
        },
        null,
        2,
      ),
    )

    // Save changes
    await page.getByRole("button", { name: "Save Changes" }).click()

    // Should redirect back to channels page
    await expect(page).toHaveURL("/notification-channels")

    // Updated name should be visible
    await expect(page.getByText("Updated Channel Name")).toBeVisible()
  })

  test("should delete notification channel", async ({ page }) => {
    // Go to first channel
    await page.click("a[href^='/notification-channels/']")

    // Click delete button
    await page.getByRole("button", { name: "Delete" }).click()

    // Confirm deletion in dialog
    await page.getByRole("button", { name: "Delete" }).click()

    // Should redirect back to channels page
    await expect(page).toHaveURL("/notification-channels")

    // Deleted channel should not be visible
    await expect(page.getByText("Updated Channel Name")).not.toBeVisible()
  })
})
