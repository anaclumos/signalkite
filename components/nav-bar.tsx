"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { Fragment } from "react"

interface NavBarProps {
  breadcrumbs: Array<{
    title: string
    href: string
  }>
  actions?: React.ReactNode
}

export function NavBar({ breadcrumbs, actions }: NavBarProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950">
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
                        ? "text-zinc-900 dark:text-zinc-50"
                        : "text-zinc-500 transition hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
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
                    className="size-4 shrink-0 text-zinc-600 dark:text-zinc-400 ml-0.5"
                    aria-hidden="true"
                  />
                )}
              </Fragment>
            ))}
          </ol>
        </nav>

        <div className="flex items-center gap-4">{actions}</div>
      </div>
    </header>
  )
}
