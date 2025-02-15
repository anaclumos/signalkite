"use client"

import { NavBar } from "@/components/nav-bar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/ui/table"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import Link from "next/link"
import { ReactNode } from "react"

interface EntityTableProps<T> {
  // Data
  data: T[]
  columns: ColumnDef<T>[]
  getRowId: (row: T) => string

  // Navigation
  basePath: string
  entityName: string

  // Card view
  renderCard: (item: T) => {
    title: string
    description: string | null
    badge?: {
      label: string
      variant: "success" | "warning" | "default"
    }
    icon?: ReactNode
    stats?: Array<{
      label: string
      value: number
    }>
  }

  // Actions
  actions?: ReactNode

  // Empty state
  emptyMessage?: string
}

export function EntityTable<T>({
  data,
  columns,
  getRowId,
  basePath,
  entityName,
  actions,
  emptyMessage = "No items found.",
}: EntityTableProps<T>) {
  const table = useReactTable<T>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId,
  })

  return (
    <div>
      <NavBar
        breadcrumbs={[
          { title: "Home", href: "/" },
          { title: entityName, href: basePath },
        ]}
        actions={actions}
      />

      {data.length === 0 ? (
        <div className="py-8 text-center text-gray-500">{emptyMessage}</div>
      ) : (
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
                      <Link href={`${basePath}/${row.id}`}>
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
      )}
    </div>
  )
}
