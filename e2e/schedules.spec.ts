import { expect, test } from "@playwright/test"

test.describe("Schedules", () => {
  test.beforeEach(async ({ page }) => {
    // Go to schedules page
    await page.goto("/schedules")
  })

  test("should navigate to individual schedule page", async ({ page }) => {
    // Click first schedule in the grid
    await page.click("a[href^='/schedules/']")

    // Verify we're on a schedule page
    await expect(page).toHaveURL(/\/schedules\/[\w-]+/)

    // Verify form elements are present
    await expect(page.getByLabel("Name")).toBeVisible()
    await expect(page.getByLabel("Hour")).toBeVisible()
    await expect(page.getByLabel("Minute")).toBeVisible()
    await expect(page.getByLabel("Timezone")).toBeVisible()
    await expect(page.getByText("Days of Week")).toBeVisible()
  })

  test("should handle non-existent schedule", async ({ page }) => {
    // Try to access non-existent schedule
    await page.goto("/schedules/non-existent-id")

    // Should show error message
    await expect(page.getByText("Schedule not found")).toBeVisible()
  })

  test("should create new schedule with all days selected by default", async ({
    page,
  }) => {
    // Go to new schedule page
    await page.goto("/schedules/new")

    // Verify all days are checked by default
    for (const day of [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]) {
      await expect(page.getByLabel(day)).toBeChecked()
    }

    // Fill out form
    await page.getByLabel("Name").fill("Test Schedule")

    // Select time
    await page.getByRole("combobox", { name: "Hour" }).click()
    await page.getByRole("option", { name: "9" }).click()

    await page.getByRole("combobox", { name: "Minute" }).click()
    await page.getByRole("option", { name: "30" }).click()

    // Create schedule
    await page.getByRole("button", { name: "Create Schedule" }).click()

    // Should redirect back to schedules page
    await expect(page).toHaveURL("/schedules")

    // New schedule should be visible
    await expect(page.getByText("Test Schedule")).toBeVisible()
  })

  test("should edit schedule", async ({ page }) => {
    // Go to first schedule
    await page.click("a[href^='/schedules/']")

    // Edit name
    await page.getByLabel("Name").fill("Updated Schedule")

    // Change time
    await page.getByRole("combobox", { name: "Hour" }).click()
    await page.getByRole("option", { name: "10" }).click()

    await page.getByRole("combobox", { name: "Minute" }).click()
    await page.getByRole("option", { name: "45" }).click()

    // Update days
    await page.getByLabel("Tuesday").check()
    await page.getByLabel("Thursday").check()

    // Save changes
    await page.getByRole("button", { name: "Save Changes" }).click()

    // Should redirect back to schedules page
    await expect(page).toHaveURL("/schedules")

    // Updated schedule should be visible
    await expect(page.getByText("Updated Schedule")).toBeVisible()
  })

  test("should show error when no days are selected", async ({ page }) => {
    // Go to new schedule page
    await page.goto("/schedules/new")

    // Fill out form
    await page.getByLabel("Name").fill("Test Schedule")

    // Select time
    await page.getByRole("combobox", { name: "Hour" }).click()
    await page.getByRole("option", { name: "9" }).click()

    await page.getByRole("combobox", { name: "Minute" }).click()
    await page.getByRole("option", { name: "30" }).click()

    // Uncheck all days
    for (const day of [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]) {
      await page.getByLabel(day).uncheck()
    }

    // Try to create schedule
    await page.getByRole("button", { name: "Create Schedule" }).click()

    // Should show error message
    await expect(
      page.getByText("At least one day must be selected"),
    ).toBeVisible()

    // Should stay on the same page
    await expect(page).toHaveURL("/schedules/new")
  })

  test("should delete schedule", async ({ page }) => {
    // Go to first schedule
    await page.click("a[href^='/schedules/']")

    // Click delete button
    await page.getByRole("button", { name: "Delete" }).click()

    // Confirm deletion in dialog
    await page.getByRole("button", { name: "Delete" }).click()

    // Should redirect back to schedules page
    await expect(page).toHaveURL("/schedules")

    // Deleted schedule should not be visible
    await expect(page.getByText("Updated Schedule")).not.toBeVisible()
  })
})
