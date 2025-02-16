"use client"

import { NavBar } from "@/components/nav-bar"
import { Card } from "@/components/ui/card"
import { Divider } from "@/components/ui/divider"
import Link from "next/link"

// Example data (you might fetch this from an API in a real-world scenario)
type Story = {
  id: number
  title: string
  date: string
  excerpt: string
}

type ReporterIssue = {
  id: number
  issueNumber: number
  publishedDate: string
  stories: Story[]
}

const reporterIssues: ReporterIssue[] = [
  {
    id: 1,
    issueNumber: 42,
    publishedDate: "July 2023",
    stories: [
      {
        id: 101,
        title: "Modern React Patterns",
        date: "July 7, 2023",
        excerpt:
          "An in-depth look at the latest best practices and patterns used in modern React development...",
      },
      {
        id: 102,
        title: "Exploring Next.js App Router",
        date: "July 8, 2023",
        excerpt:
          "A guide to structuring and routing your Next.js application using the new App Router...",
      },
    ],
  },
  {
    id: 2,
    issueNumber: 41,
    publishedDate: "June 2023",
    stories: [
      {
        id: 201,
        title: "Scaling Web Apps",
        date: "June 2, 2023",
        excerpt:
          "Tips and techniques on scaling Node.js and React applications in distributed environments...",
      },
      {
        id: 202,
        title: "Database Optimization",
        date: "June 3, 2023",
        excerpt:
          "Fine-tuning query performance, caching strategies, and indexing best practices...",
      },
      {
        id: 203,
        title: "Debugging CSS Layouts",
        date: "June 5, 2023",
        excerpt:
          "Common pitfalls in responsive design and how to fix those sneaky layout bugs...",
      },
    ],
  },
]

export default function PastReporterIssuesPage() {
  // Example: Pretend we have a reporter object from a server or API
  const reporter = { id: "abc123", name: "My Awesome Reporter" }

  // For the NavBar breadcrumbs:
  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Reporters", href: "/reporters" },
    // Show either an existing reporter’s name or a “new” label
    ...(reporter?.id
      ? [
          {
            title: reporter.name || "New Reporter",
            href: `/reporters/${reporter.id}`,
          },
        ]
      : [{ title: "New Reporter", href: "/reporters/new" }]),
  ]

  return (
    <>
      <NavBar breadcrumbs={breadcrumbs} />
      <main className="mx-auto w-full max-w-4xl p-6">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Past Reporter Issues
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Browse articles from previous reporter issues.
        </p>

        <div className="mt-6 space-y-6">
          {reporterIssues.map((issue) => (
            <Card key={issue.id} className="p-4">
              <Link href={`/issues/${issue.id}`}>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Issue #{issue.issueNumber} &middot; {issue.publishedDate}
                </h2>
              </Link>
              <Divider className="my-4" />
              <ul className="space-y-6">
                {issue.stories.map((story) => (
                  <li key={story.id}>
                    <Link href={`/stories/${story.id}`}>
                      {/* Title with link to a story detail page (or wherever you prefer) */}
                      <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:underline">
                        {story.title}
                      </h3>
                    </Link>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {story.date}
                    </p>
                    <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                      {story.excerpt}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </main>
    </>
  )
}
