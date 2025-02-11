"use client"

import { EntityTable } from "@/components/entity-table"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { useMemo } from "react"
import { PromptWithRelations } from "./types"

interface PromptsTableProps {
  initialPrompts: PromptWithRelations[]
}

export function PromptsTable({ initialPrompts }: PromptsTableProps) {
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

  return (
    <EntityTable
      data={initialPrompts}
      columns={columns}
      getRowId={(row) => row.id}
      basePath="/prompts"
      entityName="Prompts"
      renderCard={(prompt) => ({
        title: prompt.description || "Untitled Prompt",
        description: prompt.text,
        stats: [
          {
            label: "Reporters",
            value: prompt.Reporters?.length || 0,
          },
          {
            label: "Stories",
            value: prompt.Stories?.length || 0,
          },
        ],
      })}
      actions={
        <Link href="/prompts/new">
          <Button>Create</Button>
        </Link>
      }
      emptyMessage="No prompts found. Create your first prompt to get started."
    />
  )
}
