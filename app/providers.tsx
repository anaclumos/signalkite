"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { PostHogListener } from "@/components/listeners/posthog"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
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
    <PostHogProvider client={posthog}>
      <ThemeProvider
        defaultTheme="system"
        disableTransitionOnChange
        attribute="class"
      >
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <div className="w-full flex flex-col">
            <main className="h-screen flex flex-col overflow-y-auto">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </ThemeProvider>
      <SpeedInsights />
      <Analytics />
      <Toaster />
      <PostHogListener />
    </PostHogProvider>
  )
}
