import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import "./globals.css"
import { Providers } from "./providers"
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
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="bg-white-50 h-full antialiased dark:bg-zinc-950">
        <Providers defaultOpen={defaultOpen}>
          <AppSidebar />
          <div className="w-full flex flex-col">
            <main className="h-screen flex flex-col overflow-y-auto">
              {children}
            </main>
          </div>
          <SpeedInsights />
          <Analytics />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
