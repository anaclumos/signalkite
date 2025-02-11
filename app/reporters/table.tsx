"use client"

import { EntityTable } from "@/components/entity-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Reporter, ReporterStatus } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { Bot } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"

type ReporterWithRelations = Reporter & {
  Prompt: {
    id: string
    text: string | null
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    description: string | null
    creatorId: string
  } | null
  Stories: any[]
  _count: {
    Stories: number
    News: number
    Subscriptions: number
  }
}

interface ReportersTableProps {
  initialReporters: ReporterWithRelations[]
}

export function ReportersTable({ initialReporters }: ReportersTableProps) {
  const columns = useMemo<ColumnDef<ReporterWithRelations>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        enableSorting: true,
        cell: ({ row }) => row.original.name,
      },
      {
        header: "Strategy",
        accessorKey: "strategy",
        enableSorting: true,
      },
      {
        header: "Stories",
        accessorKey: "_count.Stories",
        enableSorting: true,
      },
      {
        header: "Scans",
        accessorKey: "_count.News",
        enableSorting: true,
      },
      {
        header: "Status",
        accessorKey: "status",
        enableSorting: true,
        cell: ({ getValue }) => {
          const status = getValue<ReporterStatus>()
          return (
            <Badge
              variant={
                status === ReporterStatus.ACTIVE
                  ? "success"
                  : status === ReporterStatus.PAUSED
                    ? "warning"
                    : "default"
              }
            >
              {status}
            </Badge>
          )
        },
      },
      {
        header: "Created",
        accessorKey: "createdAt",
        enableSorting: true,
        cell: ({ getValue }) => {
          const date = getValue<Date>()
          if (!date) return "-"
          return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        },
      },
    ],
    [],
  )

  return (
    <EntityTable
      data={initialReporters}
      columns={columns}
      getRowId={(row) => row.id}
      basePath="/reporters"
      entityName="Reporters"
      renderCard={(reporter) => ({
        title: reporter.name,
        description: reporter.strategy,
        icon: <Bot className="size-5 text-gray-500" />,
        badge: {
          label: reporter.status,
          variant:
            reporter.status === ReporterStatus.ACTIVE
              ? "success"
              : reporter.status === ReporterStatus.PAUSED
                ? "warning"
                : "default",
        },
        stats: [
          {
            label: "Stories",
            value: reporter._count.Stories,
          },
          {
            label: "Scans",
            value: reporter._count.News,
          },
        ],
      })}
      actions={
        <Link href="/reporters/new">
          <Button>Create</Button>
        </Link>
      }
      emptyMessage="No reporters found. Create your first reporter to get started."
    />
  )
}
