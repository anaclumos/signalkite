"use client"

import { EntityCard } from "@/components/entity-card"
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
import { ReactNode, useState } from "react"

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
  renderCard,
  actions,
  emptyMessage = "No items found.",
}: EntityTableProps<T>) {
  const [activeView, setActiveView] = useState<"grid" | "list">("grid")

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
        viewToggle={{
          value: activeView,
          onChange: (value) => setActiveView(value as "grid" | "list"),
          options: [
            { value: "grid", icon: <LayoutGrid className="size-4" /> },
            { value: "list", icon: <List className="size-4" /> },
          ],
        }}
        actions={actions}
      />

      {data.length === 0 ? (
        <div className="py-8 text-center text-gray-500">{emptyMessage}</div>
      ) : (
        <Tabs
          value={activeView}
          onValueChange={(value) => setActiveView(value as "grid" | "list")}
          className="w-full"
        >
          <TabsContent value="grid">
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
              {data.map((item) => {
                const cardProps = renderCard(item)
                return (
                  <EntityCard
                    key={getRowId(item)}
                    id={getRowId(item)}
                    href={`${basePath}/${getRowId(item)}`}
                    {...cardProps}
                  />
                )
              })}
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
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
