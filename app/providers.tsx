"use client"
import { PostHogListener } from "@/components/listeners/posthog"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "next-themes"
import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"
import { useEffect } from "react"

export function Providers({
  children,
  defaultOpen,
}: {
  children: React.ReactNode
  defaultOpen: boolean
}) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: "identified_only",
    })
  }, [])

  return (
    <ClerkProvider>
      <PostHogProvider client={posthog}>
        <ThemeProvider
          defaultTheme="system"
          disableTransitionOnChange
          attribute="class"
        >
          <SidebarProvider defaultOpen={defaultOpen}>
            {children}
          </SidebarProvider>
        </ThemeProvider>
        <PostHogListener />
      </PostHogProvider>
    </ClerkProvider>
  )
}
