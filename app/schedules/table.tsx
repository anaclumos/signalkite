"use client"

import { EntityTable } from "@/components/entity-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Schedule } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import cronstrue from "cronstrue"
import Link from "next/link"
import { useMemo } from "react"

interface SchedulesTableProps {
  initialSchedules: Schedule[]
}

export function SchedulesTable({ initialSchedules }: SchedulesTableProps) {
  const columns = useMemo<ColumnDef<Schedule>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        enableSorting: true,
        cell: ({ row }) => row.original.name,
      },
      {
        header: "Cron Expression",
        accessorKey: "cron",
        enableSorting: false,
        cell: ({ row }) => cronstrue.toString(row.original.cron),
      },
      {
        header: "Timezone",
        accessorKey: "timezone",
        enableSorting: false,
      },
      {
        header: "Status",
        accessorKey: "paused",
        enableSorting: true,
        cell: ({ getValue }) => {
          const isPaused = getValue<boolean>()
          return (
            <Badge variant={isPaused ? "default" : "success"}>
              {isPaused ? "Paused" : "Active"}
            </Badge>
          )
        },
      },
      {
        header: "Linked Reporters",
        accessorKey: "ScheduleReporters",
        enableSorting: false,
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
      data={initialSchedules}
      columns={columns}
      getRowId={(row) => row.id}
      basePath="/schedules"
      entityName="Schedules"
      renderCard={(schedule) => ({
        title: schedule.name,
        description: `${cronstrue.toString(schedule.cron)}, ${schedule.timezone.split("/").pop()} time`,
        badge: {
          label: schedule.paused ? "Paused" : "Active",
          variant: schedule.paused ? "default" : "success",
        },
      })}
      actions={
        <Link href="/schedules/new">
          <Button>Create</Button>
        </Link>
      }
      emptyMessage="No schedules found. Create your first schedule to get started."
    />
  )
}
