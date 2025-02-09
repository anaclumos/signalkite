"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"

export function Breadcrumbs() {
  const pathname = usePathname()
  const paths = pathname.split("/").filter(Boolean)

  return (
    <div className="flex items-center justify-between w-full">
      <nav aria-label="Breadcrumb" className="ml-2">
        <ol role="list" className="flex items-center space-x-3 text-sm">
          <li className="flex">
            <Link
              href="/"
              className="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 hover:dark:text-gray-300"
            >
              Home
            </Link>
          </li>
          {paths.map((path, index) => {
            const href = `/${paths.slice(0, index + 1).join("/")}`
            const isLast = index === paths.length - 1
            const isNew = path === "new"

            if (isNew) return null

            return (
              <li key={path} className="flex items-center">
                <ChevronRight
                  className="size-4 shrink-0 text-gray-600 dark:text-gray-400"
                  aria-hidden="true"
                />
                <Link
                  href={href}
                  className={
                    isLast
                      ? "ml-3 text-gray-900 dark:text-gray-50"
                      : "ml-3 text-gray-500 transition hover:text-gray-700 dark:text-gray-400 hover:dark:text-gray-300"
                  }
                  aria-current={isLast ? "page" : undefined}
                >
                  {path.charAt(0).toUpperCase() + path.slice(1)}
                </Link>
              </li>
            )
          })}
        </ol>
      </nav>

      {!pathname.endsWith("/new") && (
        <Link href={`${pathname}/new`}>
          <Button>Create</Button>
        </Link>
      )}
    </div>
  )
}
