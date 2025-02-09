"use client"

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import React from "react"

import { cx } from "@/lib/utils"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/ui/table"
import { Workspace, workspaces } from "@/data/workspaces"

const columnHelper = createColumnHelper<Workspace>()

export default function TableCheckbox() {
  const [rowSelection, setRowSelection] = React.useState({})

  React.useEffect(() => {
    // Pre-select the 2nd row for demo purpose
    setRowSelection({ 2: true })
  }, [])

  const workspacesColumns = React.useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomeRowsSelected()
                  ? "indeterminate"
                  : false
            }
            onCheckedChange={() => table.toggleAllPageRowsSelected()}
            className="translate-y-0.5"
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={() => row.toggleSelected()}
            className="translate-y-0.5"
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        meta: {
          align: "text-left",
        },
      }),
      {
        header: "Workspace",
        accessorKey: "workspace",
        enableSorting: true,
        meta: {
          align: "text-left",
        },
      },
      {
        header: "Owner",
        accessorKey: "owner",
        enableSorting: true,
        meta: {
          align: "text-left",
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        enableSorting: false,
        meta: {
          align: "text-left",
        },
      },
      {
        header: "Region",
        accessorKey: "region",
        enableSorting: false,
        meta: {
          align: "text-left",
        },
      },
      {
        header: "Capacity",
        accessorKey: "capacity",
        enableSorting: false,
        meta: {
          align: "text-left",
        },
      },
      {
        header: "Costs",
        accessorKey: "costs",
        enableSorting: false,
        meta: {
          align: "text-right",
        },
      },
      {
        header: "Last edited",
        accessorKey: "lastEdited",
        enableSorting: false,
        meta: {
          align: "text-right",
        },
      },
    ],
    [],
  )

  const table = useReactTable({
    data: workspaces,
    columns: workspacesColumns,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      rowSelection,
    },
  })

  return (
    <div>
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
              <TableRow
                key={row.id}
                onClick={() => row.toggleSelected(!row.getIsSelected())}
                className="select-none hover:bg-gray-50 hover:dark:bg-gray-900"
              >
                {row.getVisibleCells().map((cell, index) => (
                  <TableCell
                    key={cell.id}
                    className={cx(
                      row.getIsSelected() ? "bg-gray-50 dark:bg-gray-900" : "",
                      "relative",
                    )}
                  >
                    {index === 0 && row.getIsSelected() && (
                      <div className="absolute inset-y-0 left-0 w-0.5 bg-blue-500 dark:bg-blue-500" />
                    )}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>
      <div
        className={cx(
          "fixed inset-x-0 bottom-10 mx-auto flex w-fit items-center space-x-3 rounded-full border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-medium shadow-md ring-1 ring-gray-800",
          Object.keys(rowSelection).length > 0 ? "" : "hidden",
        )}
      >
        <p className="select-none tabular-nums text-gray-400">
          {Object.keys(rowSelection).length} selected
        </p>
        <span className="h-4 w-px bg-gray-600" aria-hidden={true} />
        <span className="flex items-center space-x-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm text-gray-300 transition-all hover:text-gray-50"
          >
            Edit
            <span className="flex size-6 select-none items-center justify-center rounded-md bg-gray-800 text-gray-400 ring-1 ring-inset ring-gray-700">
              E
            </span>
          </button>
        </span>
        <span className="h-4 w-px bg-gray-600" aria-hidden={true} />
        <span className="flex items-center space-x-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm text-gray-300 transition-all hover:text-gray-50"
          >
            Delete
            <span className="flex items-center space-x-1">
              <span className="flex size-6 select-none items-center justify-center rounded-md bg-gray-800 text-gray-400 ring-1 ring-inset ring-gray-700">
                ⌘
              </span>
              <span className="flex size-6 select-none items-center justify-center rounded-md bg-gray-800 text-gray-400 ring-1 ring-inset ring-gray-700">
                D
              </span>
            </span>
          </button>
        </span>
      </div>
    </div>
  )
}
