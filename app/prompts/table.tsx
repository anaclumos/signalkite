"use client"

import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { LayoutGrid, List } from "lucide-react"
import Link from "next/link"
import React, { useMemo, useState } from "react"
import { PromptWithRelations } from "./types"

interface PromptsTableProps {
  initialPrompts: PromptWithRelations[]
}

export function PromptsTable({ initialPrompts }: PromptsTableProps) {
  const [prompts] = React.useState<PromptWithRelations[]>(initialPrompts)
  const [activeView, setActiveView] = useState<"grid" | "list">("grid")

  const columns = useMemo<ColumnDef<PromptWithRelations>[]>(
    () => [
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
        header: "Linked Reporters",
        accessorKey: "Reporters",
        enableSorting: false,
        cell: ({ row }) => row.original.Reporters?.length || 0,
      },
      {
        header: "Linked Stories",
        accessorKey: "Stories",
        enableSorting: false,
        cell: ({ row }) => row.original.Stories?.length || 0,
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

  const table = useReactTable<PromptWithRelations>({
    data: prompts,
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
          { title: "Prompts", href: "/prompts" },
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
          <Link href={`/prompts/new`}>
            <Button>Create</Button>
          </Link>
        }
      />
      {prompts.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No prompts found. Create your first prompt to get started.
        </div>
      ) : (
        <Tabs
          value={activeView}
          onValueChange={(value) => setActiveView(value as "grid" | "list")}
          className="w-full"
        >
          <TabsContent value="grid">
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
              {prompts.map((prompt) => (
                <Link key={prompt.id} href={`/prompts/${prompt.id}`}>
                  <Card className="p-4 transition hover:bg-gray-50 dark:hover:bg-gray-900">
                    <h3 className="font-medium">
                      {prompt.description || "Untitled Prompt"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {prompt.text
                        ? prompt.text.length > 100
                          ? prompt.text.slice(0, 100) + "..."
                          : prompt.text
                        : "No text"}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <span className="text-xs text-gray-500">
                        {prompt.Reporters?.length || 0} Reporters
                      </span>
                      <span className="text-xs text-gray-500">
                        {prompt.Stories?.length || 0} Stories
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list">
            <TableRoot>
              {prompts.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  No prompts found. Create your first prompt to get started.
                </div>
              ) : (
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
                            <Link href={`/prompts/${row.original.id}`}>
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
              )}
            </TableRoot>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
