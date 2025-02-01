"use client"

import {
  RiLayoutGridLine,
  RiListUnordered,
  RiStackLine,
} from "@remixicon/react"

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

const data = [
  {
    name: "Test Workspace",
    icon: RiStackLine,
    href: "#",
    details: [
      {
        type: "Storage",
        value: "5/10GB",
      },
      {
        type: "Users",
        value: "89/100",
      },
      {
        type: "Requests",
        value: "995/10K",
      },
      {
        type: "Status",
        value: "Live",
      },
    ],
  },
  {
    name: "BI Workspace",
    icon: RiStackLine,
    href: "#",
    details: [
      {
        type: "Storage",
        value: "9.8/10GB",
      },
      {
        type: "Users",
        value: "23/100",
      },
      {
        type: "Requests",
        value: "435/10K",
      },
      {
        type: "Status",
        value: "Inactive",
      },
    ],
  },
  {
    name: "Livestream",
    icon: RiStackLine,
    href: "#",
    details: [
      {
        type: "Storage",
        value: "5.6/10GB",
      },
      {
        type: "Users",
        value: "79/100",
      },
      {
        type: "Requests",
        value: "642/10K",
      },
      {
        type: "Status",
        value: "Live",
      },
    ],
  },
  {
    name: "Prod Workspace",
    icon: RiStackLine,
    href: "#",
    details: [
      {
        type: "Storage",
        value: "9.8/10GB",
      },
      {
        type: "Users",
        value: "23/100",
      },
      {
        type: "Requests",
        value: "435/10K",
      },
      {
        type: "Status",
        value: "Inactive",
      },
    ],
  },
  {
    name: "Test Pipelines",
    icon: RiStackLine,
    href: "#",
    details: [
      {
        type: "Storage",
        value: "5.9/10GB",
      },
      {
        type: "Users",
        value: "89/100",
      },
      {
        type: "Requests",
        value: "995/10K",
      },
      {
        type: "Status",
        value: "Live",
      },
    ],
  },
]

export default function Example() {
  return (
    <div className="p-4">
      <Tabs defaultValue="tab1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
              Workspaces
            </h3>
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-50">
              {data.length}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <TabsList
              variant="solid"
              className="-mx-1 bg-transparent dark:bg-transparent"
            >
              <TabsTrigger
                value="tab1"
                className="rounded-md py-1.5 data-[state=active]:text-blue-500 data-[state=active]:ring-1 data-[state=active]:ring-inset data-[state=active]:ring-gray-200 data-[state=active]:dark:bg-[#090E1A] data-[state=active]:dark:text-blue-500 data-[state=active]:dark:ring-gray-800"
              >
                <RiLayoutGridLine
                  className="size-5 shrink-0"
                  aria-hidden={true}
                />
              </TabsTrigger>
              <TabsTrigger
                value="tab2"
                className="rounded-md py-1.5 data-[state=active]:text-blue-500 data-[state=active]:ring-1 data-[state=active]:ring-inset data-[state=active]:ring-gray-200 data-[state=active]:dark:bg-[#090E1A] data-[state=active]:dark:text-blue-500 data-[state=active]:dark:ring-gray-800"
              >
                <RiListUnordered
                  className="size-5 shrink-0"
                  aria-hidden={true}
                />
              </TabsTrigger>
            </TabsList>
            <div className="hidden h-8 w-px bg-gray-200 dark:bg-gray-800 sm:block" />
            <Button>Add workspace</Button>
          </div>
        </div>
        <Divider className="my-4" />
        <TabsContent value="tab1">
          <ul
            role="list"
            className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {data.map((workspace) => (
              <Card
                key={workspace.name}
                className="relative overflow-hidden p-0"
                asChild
              >
                <li>
                  <div className="border-b border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center space-x-3">
                      <span className="flex size-12 items-center justify-center rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#090E1A]">
                        <workspace.icon
                          className="size-5 text-gray-500 dark:text-gray-500"
                          aria-hidden={true}
                        />
                      </span>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                        <a href={workspace.href} className="focus:outline-none">
                          {/* Extend link to entire card */}
                          <span
                            className="absolute inset-0"
                            aria-hidden={true}
                          />
                          {workspace.name}
                        </a>
                      </h3>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <ul
                      role="list"
                      className="divide-y divide-gray-200 text-sm text-gray-500 dark:divide-gray-800 dark:text-gray-500"
                    >
                      {workspace.details.map((item) => (
                        <li
                          key={item.type}
                          className="flex items-center justify-between py-2.5"
                        >
                          <span>{item.type}</span>
                          {item.value === "Live" ? (
                            <span className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-400/10 dark:text-emerald-500 dark:ring-emerald-400/20">
                              {item.value}
                            </span>
                          ) : item.value === "Inactive" ? (
                            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:ring-gray-800">
                              {item.value}
                            </span>
                          ) : (
                            <span className="font-medium text-gray-900 dark:text-gray-50">
                              {item.value}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </Card>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="tab2">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Storage</TableHeaderCell>
                <TableHeaderCell>Users</TableHeaderCell>
                <TableHeaderCell>Requests/Limit</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>
                  <span className="sr-only">Edit</span>
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((workspace) => (
                <TableRow
                  key={workspace.name}
                  className="hover:bg-gray-50 hover:dark:bg-gray-900"
                >
                  <TableCell className="font-medium text-gray-900 dark:text-gray-50">
                    {workspace.name}
                  </TableCell>
                  <TableCell>{workspace.details[0].value}</TableCell>
                  <TableCell>{workspace.details[1].value}</TableCell>
                  <TableCell>{workspace.details[2].value}</TableCell>
                  <TableCell>
                    {workspace.details[3].value === "Live" ? (
                      <span className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-400/10 dark:text-emerald-500 dark:ring-emerald-400/20">
                        {workspace.details[3].value}
                      </span>
                    ) : workspace.details[3].value === "Inactive" ? (
                      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:ring-gray-800">
                        {workspace.details[3].value}
                      </span>
                    ) : (
                      <span className="font-medium text-gray-900 dark:text-gray-50">
                        {workspace.details[3].value}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <a
                      href={workspace.href}
                      className="font-medium text-blue-500 dark:text-blue-500"
                    >
                      Edit<span className="sr-only">{workspace.name}</span>
                    </a>
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
