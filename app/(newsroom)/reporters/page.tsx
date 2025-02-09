"use client"

import {
  RiLayoutGridLine,
  RiListUnordered,
  RiRobot2Line,
} from "@remixicon/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { getReporters } from "@/app/actions/reporters"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Divider } from "@/components/ui/divider"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/lib/use-toast"
import { Reporter, ReporterStatus } from "@prisma/client"

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

export default function ReportersPage() {
  const [reporters, setReporters] = useState<ReporterWithRelations[]>([])
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadReporters()
  }, [])

  async function loadReporters() {
    try {
      const data = await getReporters()
      setReporters(data)
    } catch (error) {
      toast({
        title: "Error loading reporters",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "error",
      })
    }
  }

  return (
    <div className="p-4">
      <Tabs defaultValue="grid">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
              Reporters
            </h3>
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-50">
              {reporters.length}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <TabsList
              variant="solid"
              className="-mx-1 bg-transparent dark:bg-transparent"
            >
              <TabsTrigger
                value="grid"
                className="rounded-md py-1.5 data-[state=active]:text-blue-500 data-[state=active]:ring-1 data-[state=active]:ring-inset data-[state=active]:ring-gray-200 data-[state=active]:dark:bg-[#090E1A] data-[state=active]:dark:text-blue-500 data-[state=active]:dark:ring-gray-800"
              >
                <RiLayoutGridLine
                  className="size-5 shrink-0"
                  aria-hidden={true}
                />
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="rounded-md py-1.5 data-[state=active]:text-blue-500 data-[state=active]:ring-1 data-[state=active]:ring-inset data-[state=active]:ring-gray-200 data-[state=active]:dark:bg-[#090E1A] data-[state=active]:dark:text-blue-500 data-[state=active]:dark:ring-gray-800"
              >
                <RiListUnordered
                  className="size-5 shrink-0"
                  aria-hidden={true}
                />
              </TabsTrigger>
            </TabsList>
            <div className="hidden h-8 w-px bg-gray-200 dark:bg-gray-800 sm:block" />
            <Button onClick={() => router.push("/reporters/new")}>
              Add reporter
            </Button>
          </div>
        </div>
        <Divider className="my-4" />
        <TabsContent value="grid">
          <ul
            role="list"
            className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {reporters.map((reporter) => (
              <Card
                key={reporter.id}
                className="relative overflow-hidden p-0"
                asChild
              >
                <li>
                  <div className="border-b border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center space-x-3">
                      <span className="flex size-12 items-center justify-center rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#090E1A]">
                        <RiRobot2Line
                          className="size-5 text-gray-500 dark:text-gray-500"
                          aria-hidden={true}
                        />
                      </span>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                        <button
                          onClick={() =>
                            router.push(`/reporters/${reporter.id}`)
                          }
                          className="focus:outline-none"
                        >
                          <span
                            className="absolute inset-0"
                            aria-hidden={true}
                          />
                          {reporter.name}
                        </button>
                      </h3>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <ul
                      role="list"
                      className="divide-y divide-gray-200 text-sm text-gray-500 dark:divide-gray-800 dark:text-gray-500"
                    >
                      <li className="flex items-center justify-between py-2.5">
                        <span>Strategy</span>
                        <span className="font-medium text-gray-900 dark:text-gray-50">
                          {reporter.strategy}
                        </span>
                      </li>
                      <li className="flex items-center justify-between py-2.5">
                        <span>Stories</span>
                        <span className="font-medium text-gray-900 dark:text-gray-50">
                          {reporter._count.Stories}
                        </span>
                      </li>
                      <li className="flex items-center justify-between py-2.5">
                        <span>Scans</span>
                        <span className="font-medium text-gray-900 dark:text-gray-50">
                          {reporter._count.News}
                        </span>
                      </li>
                      <li className="flex items-center justify-between py-2.5">
                        <span>Status</span>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                            reporter.status === ReporterStatus.ACTIVE
                              ? "bg-emerald-100 text-emerald-800 ring-emerald-600/10 dark:bg-emerald-400/10 dark:text-emerald-500 dark:ring-emerald-400/20"
                              : reporter.status === ReporterStatus.PAUSED
                                ? "bg-yellow-100 text-yellow-800 ring-yellow-600/10 dark:bg-yellow-400/10 dark:text-yellow-500 dark:ring-yellow-400/20"
                                : "bg-gray-50 text-gray-700 ring-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:ring-gray-800"
                          }`}
                        >
                          {reporter.status}
                        </span>
                      </li>
                    </ul>
                  </div>
                </li>
              </Card>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="list">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Strategy</TableHeaderCell>
                <TableHeaderCell>Stories</TableHeaderCell>
                <TableHeaderCell>Scans</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>
                  <span className="sr-only">Edit</span>
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reporters.map((reporter) => (
                <TableRow
                  key={reporter.id}
                  className="hover:bg-gray-50 hover:dark:bg-gray-900"
                >
                  <TableCell className="font-medium text-gray-900 dark:text-gray-50">
                    {reporter.name}
                  </TableCell>
                  <TableCell>{reporter.strategy}</TableCell>
                  <TableCell>{reporter._count.Stories}</TableCell>
                  <TableCell>{reporter._count.News}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                        reporter.status === ReporterStatus.ACTIVE
                          ? "bg-emerald-100 text-emerald-800 ring-emerald-600/10 dark:bg-emerald-400/10 dark:text-emerald-500 dark:ring-emerald-400/20"
                          : reporter.status === ReporterStatus.PAUSED
                            ? "bg-yellow-100 text-yellow-800 ring-yellow-600/10 dark:bg-yellow-400/10 dark:text-yellow-500 dark:ring-yellow-400/20"
                            : "bg-gray-50 text-gray-700 ring-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:ring-gray-800"
                      }`}
                    >
                      {reporter.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => router.push(`/reporters/${reporter.id}`)}
                      className="font-medium text-blue-500 dark:text-blue-500"
                    >
                      Edit<span className="sr-only">{reporter.name}</span>
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  )
}
