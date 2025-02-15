"use client"

import { NavBar } from "@/components/nav-bar"
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
import { Prompt } from "@prisma/client"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import Link from "next/link"
import { useMemo } from "react"

interface PromptsTableProps {
  initialPrompts: Prompt[]
}

export function PromptsTable({ initialPrompts }: PromptsTableProps) {
  const columns = useMemo<ColumnDef<Prompt>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        enableSorting: true,
      },
      {
        header: "Description",
        accessorKey: "description",
        enableSorting: true,
        cell: ({ row }) => row.original.description || "-",
      },
      {
        header: "Text Preview",
        accessorKey: "text",
        enableSorting: false,
        cell: ({ row }) => {
          const text = row.original.text
          if (!text) return "-"
          return text.length > 100 ? text.slice(0, 100) + "..." : text
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

  const table = useReactTable<Prompt>({
    data: initialPrompts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id,
  })

  return (
    <div>
      <NavBar
        breadcrumbs={[
          { title: "Home", href: "/" },
          { title: "Prompts", href: "/prompts" },
        ]}
        actions={
          <Link href="/prompts/new">
            <Button>Create</Button>
          </Link>
        }
      />

      {initialPrompts.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No prompts found. Create your first prompt to get started.
        </div>
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
                      <Link href={`/prompts/${row.id}`}>
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
