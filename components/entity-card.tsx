import { Card } from "@/components/ui/card"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { startCase } from "es-toolkit/string"
import { ReactNode } from "react"

interface EntityCardProps {
  id: string
  href: string
  title: string
  description: string | null
  icon?: ReactNode
  badge?: {
    label: string
    variant: "success" | "warning" | "default"
  }
  stats?: Array<{
    label: string
    value: number
  }>
}

export function EntityCard({
  id,
  href,
  title,
  description,
  icon,
  badge,
  stats,
}: EntityCardProps) {
  return (
    <Link key={id} href={href}>
      <Card className="p-4 transition hover:bg-gray-50 dark:hover:bg-gray-900">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex size-10 items-center justify-center rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <h3 className="flex items-center justify-between gap-2 font-medium">
              {title}
              {badge && (
                <Badge variant={badge.variant}>{startCase(badge.label)}</Badge>
              )}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {description
                ? description.length > 100
                  ? description.slice(0, 100) + "..."
                  : description
                : "No description"}
            </p>
          </div>
        </div>
        {stats && stats.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-gray-500">{stat.label}</div>
                <div className="font-medium">{stat.value}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Link>
  )
}
