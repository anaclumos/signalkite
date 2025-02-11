"use client"

import { EntityCard } from "@/components/entity-card"
import { NavBar } from "@/components/nav-bar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Reporter, ReporterStatus } from "@prisma/client"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Bot, LayoutGrid, List } from "lucide-react"
import Link from "next/link"
import React, { useMemo, useState } from "react"

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
  const [reporters] = React.useState<ReporterWithRelations[]>(initialReporters)
  const [activeView, setActiveView] = useState<"grid" | "list">("grid")

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

  const table = useReactTable<ReporterWithRelations>({
    data: reporters,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (originalRow) => originalRow.id,
  })

  return (
    <div>
      <NavBar
        breadcrumbs={[
          { title: "Home", href: "/" },
          { title: "Reporters", href: "/reporters" },
        ]}
        viewToggle={{
          value: activeView,
          onChange: (value) => setActiveView(value as "grid" | "list"),
          options: [
            { value: "grid", icon: <LayoutGrid className="size-4" /> },
            { value: "list", icon: <List className="size-4" /> },
          ],
        }}
        actions={
          <Link href={`/reporters/new`}>
            <Button>Create</Button>
          </Link>
        }
      />

      {reporters.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No reporters found. Create your first reporter to get started.
        </div>
      ) : (
        <Tabs
          value={activeView}
          onValueChange={(value) => setActiveView(value as "grid" | "list")}
          className="w-full"
        >
          <TabsContent value="grid">
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
              {reporters.map((reporter) => (
                <EntityCard
                  key={reporter.id}
                  id={reporter.id}
                  href={`/reporters/${reporter.id}`}
                  title={reporter.name}
                  description={reporter.strategy}
                  icon={<Bot className="size-5 text-gray-500" />}
                  badge={{
                    label: reporter.status,
                    variant:
                      reporter.status === ReporterStatus.ACTIVE
                        ? "success"
                        : reporter.status === ReporterStatus.PAUSED
                          ? "warning"
                          : "default",
                  }}
                  stats={[
                    {
                      label: "Stories",
                      value: reporter._count.Stories,
                    },
                    {
                      label: "Scans",
                      value: reporter._count.News,
                    },
                  ]}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list">
            <TableRoot>
              <Table>
                <TableHead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHeaderCell key={header.id}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </TableHeaderCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>

                <TableBody className="divide-y divide-gray-200">
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          <Link href={`/reporters/${row.original.id}`}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </Link>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableRoot>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
