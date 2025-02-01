"use client"
import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table"
import { quotes } from "@/data/data"
import { cx } from "@/lib/utils"
import { Download } from "lucide-react"
import { Fragment } from "react"

const colorClasses = [
  "bg-blue-500 dark:bg-blue-500",
  "bg-purple-500 dark:bg-purple-500",
  "bg-emerald-500 dark:bg-emerald-500",
  "bg-cyan-500 dark:bg-cyan-500",
  "bg-rose-500 dark:bg-rose-500",
  "bg-indigo-500 dark:bg-indigo-500",
]

const getRandomColor = (initials: string) => {
  const seed = initials
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colorClasses[seed % colorClasses.length]
}
export default function Overview() {
  return (
    <section aria-label="Overview Table">
      <div className="flex flex-col justify-between gap-2 px-4 py-6 sm:flex-row sm:items-center sm:p-6">
        <Input
          type="search"
          placeholder="Search quotes..."
          className="sm:w-64 [&>input]:py-1.5"
        />
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <Select>
            <SelectTrigger className="w-full py-1.5 sm:w-44">
              <SelectValue placeholder="Assigned to..." />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="1">Harry Granger</SelectItem>
              <SelectItem value="2">Hermoine Weasley</SelectItem>
              <SelectItem value="3">Emma Stone</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="secondary"
            className="w-full gap-2 py-1.5 text-base sm:w-fit sm:text-sm"
          >
            <Download
              className="-ml-0.5 size-4 shrink-0 text-gray-400 dark:text-gray-600"
              aria-hidden="true"
            />
            Export
          </Button>
        </div>
      </div>
      <TableRoot className="border-t border-gray-200 dark:border-gray-800">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Company</TableHeaderCell>
              <TableHeaderCell>Deal Size</TableHeaderCell>
              <TableHeaderCell>Win Probability</TableHeaderCell>
              <TableHeaderCell>Project Duration</TableHeaderCell>
              <TableHeaderCell>Assigned</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quotes.map((quote) => (
              <Fragment key={quote.region}>
                <TableRow>
                  <TableHeaderCell
                    scope="colgroup"
                    colSpan={6}
                    className="bg-gray-50 py-3 pl-4 sm:pl-6 dark:bg-gray-900"
                  >
                    {quote.region}
                    <span className="ml-2 font-medium text-gray-600 dark:text-gray-400">
                      {quote.project.length}
                    </span>
                  </TableHeaderCell>
                </TableRow>
                {quote.project.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.company}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>{item.probability}</TableCell>
                    <TableCell>{item.duration}</TableCell>
                    <TableCell>
                      <div className="flex -space-x-1 overflow-hidden">
                        {item.assigned.map((name, nameIndex) => (
                          <span
                            key={nameIndex}
                            className={cx(
                              getRandomColor(name.initials),
                              "inline-flex size-5 items-center justify-center rounded-full text-xs font-medium text-white ring-2 ring-white dark:text-white dark:ring-[#090E1A]",
                            )}
                          >
                            {name.initials}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "Closed"
                            ? "success"
                            : item.status === "Drafted"
                              ? "neutral"
                              : item.status === "Sent"
                                ? "default"
                                : "default"
                        }
                        className="rounded-full"
                      >
                        <span
                          className={cx(
                            "size-1.5 shrink-0 rounded-full",
                            "bg-gray-500 dark:bg-gray-500",
                            {
                              "bg-emerald-600 dark:bg-emerald-400":
                                item.status === "Closed",
                            },
                            {
                              "bg-gray-500 dark:bg-gray-500":
                                item.status === "Drafted",
                            },
                            {
                              "bg-blue-500 dark:bg-blue-500":
                                item.status === "Sent",
                            },
                          )}
                          aria-hidden="true"
                        />
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableRoot>
    </section>
  )
}
