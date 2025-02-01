"use client"
import {
  TabNavigation,
  TabNavigationLink,
} from "@/components/ui/tab-navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"
import { siteConfig } from "../site-config"

const navigation = [
  { name: "Overview", href: siteConfig.baseLinks.quotes.overview },
  { name: "Monitoring", href: siteConfig.baseLinks.quotes.monitoring },
  { name: "Audits", href: siteConfig.baseLinks.quotes.audits },
]
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  return (
    <>
      <div className="bg-white dark:bg-gray-925">
        <TabNavigation className="mt-6 gap-x-4 px-4 sm:px-6">
          {navigation.map((item) => (
            <TabNavigationLink
              key={item.name}
              asChild
              active={pathname === item.href}
            >
              <Link href={item.href}>{item.name}</Link>
            </TabNavigationLink>
          ))}
        </TabNavigation>
        <>{children}</>
      </div>
    </>
  )
}
