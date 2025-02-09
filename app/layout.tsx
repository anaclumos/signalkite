import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ClerkProvider } from "@clerk/nextjs"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { cookies } from "next/headers"
import "./globals.css"
import { siteConfig } from "./site-config"
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: ["Dashboard", "Data Visualization", "Software"],
  authors: [
    {
      name: siteConfig.name,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.creator,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: `@${siteConfig.creator}`,
  },
  icons: {
    icon: "/favicon.svg",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value
    ? cookieStore.get("sidebar:state")?.value === "true"
    : true

  return (
    <ClerkProvider>
      <html lang="en" className="h-full" suppressHydrationWarning>
        <body className="bg-white-50 h-full antialiased dark:bg-gray-950">
          <ThemeProvider
            defaultTheme="system"
            disableTransitionOnChange
            attribute="class"
          >
            <SidebarProvider defaultOpen={defaultOpen}>
              <AppSidebar />
              <div className="w-full flex flex-col">
                <main className="flex-1">{children}</main>
              </div>
            </SidebarProvider>
          </ThemeProvider>
          <SpeedInsights />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
