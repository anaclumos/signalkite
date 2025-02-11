import { Page } from "@playwright/test"

interface MockUser {
  id: string
  emailAddresses?: Array<{
    id: string
    emailAddress: string
  }>
  phoneNumbers?: Array<{
    id: string
    phoneNumber: string
  }>
  primaryEmailAddressId?: string
  primaryPhoneNumberId?: string
}

export async function mockClerkUser(page: Page, user: MockUser) {
  // Intercept Clerk's currentUser endpoint
  await page.route("**/v1/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ...user,
        // Add required Clerk user fields
        passwordEnabled: true,
        totpEnabled: false,
        backupCodeEnabled: false,
        twoFactorEnabled: false,
        banned: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        imageUrl: "",
        hasImage: false,
        lastName: "",
        firstName: "",
        username: "",
        externalId: "",
        lastSignInAt: Date.now(),
        publicMetadata: {},
        privateMetadata: {},
        unsafeMetadata: {},
        web3Wallets: [],
        primaryWeb3WalletId: null,
        externalAccounts: [],
        lastActiveAt: Date.now(),
        createOrganizationEnabled: false,
      }),
    })
  })

  // Mock Clerk's session token
  await page.evaluate(() => {
    window.localStorage.setItem("__clerk_client_jwt", "mock_jwt_token")
  })
}
