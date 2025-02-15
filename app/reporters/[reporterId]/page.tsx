import { getReporter } from "@/app/actions/reporters"
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
import { notFound } from "next/navigation"

export default async function ReporterPage({
  params,
}: {
  params: Promise<{ reporterId: string }>
}) {
  const { reporterId } = await params
  const reporter = await getReporter(reporterId)

  if (!reporter) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold break-all">{reporter.name}</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {reporter.description || "No description"}
          </p>
          <div className="text-sm text-zinc-500">
            Strategy: {reporter.strategy}
          </div>
          <div className="text-sm text-zinc-500">Status: {reporter.status}</div>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-lg font-semibold">Past Scans</h3>
        <TableRoot>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Created At</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reporter.Stories.map((story) => (
                <TableRow key={story.id}>
                  <TableCell>Story</TableCell>
                  <TableCell>
                    {new Date(story.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              ))}
              {reporter.Issues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell>Issue</TableCell>
                  <TableCell>
                    {new Date(issue.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {issue.successful ? "Success" : "Failed"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableRoot>
      </Card>
    </div>
  )
}
