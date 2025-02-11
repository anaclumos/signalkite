import { expect, test } from "@playwright/test"
import { mockClerkUser } from "./utils/mock-clerk"

test.describe("Notification Channels", () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated user with email and phone
    await mockClerkUser(page, {
      id: "user_123",
      emailAddresses: [
        {
          id: "email_123",
          emailAddress: "test@example.com",
        },
      ],
      phoneNumbers: [
        {
          id: "phone_123",
          phoneNumber: "+1234567890",
        },
      ],
      primaryEmailAddressId: "email_123",
      primaryPhoneNumberId: "phone_123",
    })
  })

  test("should display Clerk email and SMS channels", async ({ page }) => {
    // Navigate to notification channels page
    await page.goto("/notification-channels")

    // Check if email channel is displayed
    await expect(page.getByText("Email - test@example.com")).toBeVisible()
    await expect(page.getByText("EMAIL")).toBeVisible()
    await expect(page.getByText("Configured")).toBeVisible()

    // Check if SMS channel is displayed
    await expect(page.getByText("SMS - +1234567890")).toBeVisible()
    await expect(page.getByText("SMS")).toBeVisible()
    await expect(page.getByText("Configured")).toBeVisible()
  })

  test("should sync channels on page load", async ({ page }) => {
    // Navigate to notification channels page
    await page.goto("/notification-channels")

    // Wait for sync to complete
    await page.waitForResponse((response) =>
      response.url().includes("/notification-channels"),
    )

    // Verify channels are displayed
    await expect(page.getByText("Email - test@example.com")).toBeVisible()
    await expect(page.getByText("SMS - +1234567890")).toBeVisible()
  })

  test("should handle no Clerk channels", async ({ page }) => {
    // Mock user without email or phone
    await mockClerkUser(page, {
      id: "user_123",
      emailAddresses: [],
      phoneNumbers: [],
    })

    // Navigate to notification channels page
    await page.goto("/notification-channels")

    // Check if empty state message is displayed
    await expect(page.getByText("No notification channels found")).toBeVisible()
  })

  test("should redirect to sign in when not authenticated", async ({
    page,
  }) => {
    // Clear auth state
    await page.evaluate(() => window.localStorage.clear())

    // Try to access notification channels page
    await page.goto("/notification-channels")

    // Should be redirected to sign in
    expect(page.url()).toContain("/sign-in")
  })

  test("should handle webhook events", async ({ page, request }) => {
    // Create webhook payload for user.created event
    const webhookPayload = {
      type: "user.created",
      data: {
        id: "user_123",
        email_addresses: [
          {
            id: "email_123",
            email_address: "test@example.com",
          },
        ],
        phone_numbers: [
          {
            id: "phone_123",
            phone_number: "+1234567890",
          },
        ],
        primary_email_address_id: "email_123",
        primary_phone_number_id: "phone_123",
      },
    }

    // Send webhook request
    const response = await request.post("/api/webhooks", {
      data: webhookPayload,
      headers: {
        "svix-id": "msg_123",
        "svix-timestamp": Date.now().toString(),
        "svix-signature": "test_signature",
      },
    })

    // Verify webhook response
    expect(response.status()).toBe(200)
    expect(await response.text()).toBe("Webhook processed")

    // Navigate to notification channels page
    await page.goto("/notification-channels")

    // Verify channels were created
    await expect(page.getByText("Email - test@example.com")).toBeVisible()
    await expect(page.getByText("SMS - +1234567890")).toBeVisible()
  })
})
