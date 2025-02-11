"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { Fragment } from "react"

interface NavBarProps {
  breadcrumbs: Array<{
    title: string
    href: string
  }>
  actions?: React.ReactNode
  viewToggle?: {
    value: string
    onChange: (value: string) => void
    options: Array<{
      value: string
      icon: React.ReactNode
    }>
  }
}

export function NavBar({ breadcrumbs, actions, viewToggle }: NavBarProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950">
      <SidebarTrigger className="-ml-1" />
      <div className="flex w-full items-center justify-between">
        <nav aria-label="Breadcrumb" className="ml-2">
          <ol role="list" className="flex items-center text-sm gap-2">
            {breadcrumbs.map((crumb, index) => (
              <Fragment key={crumb.href}>
                <li className="flex items-center">
                  <Link
                    href={crumb.href}
                    className={
                      index === breadcrumbs.length - 1
                        ? "text-gray-900 dark:text-gray-50"
                        : "text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }
                    aria-current={
                      index === breadcrumbs.length - 1 ? "page" : undefined
                    }
                  >
                    {crumb.title}
                  </Link>
                </li>
                {index < breadcrumbs.length - 1 && (
                  <ChevronRight
                    className="size-4 shrink-0 text-gray-600 dark:text-gray-400 ml-0.5"
                    aria-hidden="true"
                  />
                )}
              </Fragment>
            ))}
          </ol>
        </nav>

        <div className="flex items-center gap-4">
          {viewToggle && (
            <Tabs value={viewToggle.value} onValueChange={viewToggle.onChange}>
              <TabsList variant="solid">
                {viewToggle.options.map((option) => (
                  <TabsTrigger key={option.value} value={option.value}>
                    {option.icon}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
          {actions}
        </div>
      </div>
    </header>
  )
}
