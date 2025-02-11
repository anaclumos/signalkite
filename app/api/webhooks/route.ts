import { db } from "@/prisma"
import { WebhookEvent } from "@clerk/nextjs/server"
import { Webhook } from "svix"

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local",
    )
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const svix_id = req.headers.get("svix-id")
  const svix_timestamp = req.headers.get("svix-timestamp")
  const svix_signature = req.headers.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Error: Could not verify webhook:", err)
    return new Response("Error: Verification error", {
      status: 400,
    })
  }

  // Handle user.created and user.updated events
  if (evt.type === "user.created" || evt.type === "user.updated") {
    const { id: clerkUserId, email_addresses, phone_numbers } = evt.data

    // Ensure user exists in our database
    await db.user.upsert({
      where: { authProviderUid: clerkUserId },
      create: {
        authProviderUid: clerkUserId,
      },
      update: {},
    })

    // Get primary email and phone
    const primaryEmail = email_addresses?.find(
      (email) => email.id === evt.data.primary_email_address_id,
    )
    const primaryPhone = phone_numbers?.find(
      (phone) => phone.id === evt.data.primary_phone_number_id,
    )

    if (primaryEmail) {
      // Create/update email notification channel
      await db.notificationChannel.upsert({
        where: { clerkId: primaryEmail.id },
        create: {
          name: `Email - ${primaryEmail.email_address}`,
          type: "EMAIL",
          settings: { email: primaryEmail.email_address },
          clerkId: primaryEmail.id,
          user: {
            connect: {
              authProviderUid: clerkUserId,
            },
          },
        },
        update: {
          settings: { email: primaryEmail.email_address },
        },
      })
    }

    if (primaryPhone) {
      // Create/update TEXT notification channel
      await db.notificationChannel.upsert({
        where: { clerkId: primaryPhone.id },
        create: {
          name: `TEXT - ${primaryPhone.phone_number}`,
          type: "TEXT",
          settings: { phone: primaryPhone.phone_number },
          clerkId: primaryPhone.id,
          user: {
            connect: {
              authProviderUid: clerkUserId,
            },
          },
        },
        update: {
          settings: { phone: primaryPhone.phone_number },
        },
      })
    }
  }

  return new Response("Webhook processed", { status: 200 })
}
