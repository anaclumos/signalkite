"use server"

import {
  deleteSubscription,
  upsertSubscription,
} from "@/app/actions/subscriptions"
import { FormState } from "@/types/forms"

export async function subscribeToReporter(
  prevStatus: FormState | null,
  formData: FormData,
): Promise<FormState> {
  const reporterId = formData.get("reporterId") as string
  try {
    await upsertSubscription({ reporterId })
    return {
      success: true,
      statusTitle: "Subscribed",
      statusDescription: "You are now subscribed to this reporter",
    }
  } catch (error) {
    return {
      success: false,
      statusTitle: "Failed to Subscribe",
      statusDescription: (error as Error).message,
    }
  }
}

export async function unsubscribeFromReporter(
  prevStatus: FormState | null,
  formData: FormData,
): Promise<FormState> {
  const reporterId = formData.get("reporterId") as string
  try {
    await deleteSubscription(reporterId)
    return {
      success: true,
      statusTitle: "Unsubscribed",
      statusDescription: "You are no longer subscribed to this reporter",
    }
  } catch (error) {
    return {
      success: false,
      statusTitle: "Failed to Unsubscribe",
      statusDescription: (error as Error).message,
    }
  }
}
