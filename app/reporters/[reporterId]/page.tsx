"use client"

import { NavBar } from "@/components/nav-bar"
import { Card } from "@/components/ui/card"
import { Divider } from "@/components/ui/divider"
import Link from "next/link"
import { Fragment } from "react"

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
  summary: string
  author: string
  stories: Story[]
}

const issues: ReporterIssue[] = [
  {
    id: 1,
    issueNumber: 42,
    publishedDate: "July 2023",
    summary:
      "Focus on advanced React patterns, state management, and deeper insights into Next.js App Router best practices.",
    author: "John Smith",
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
      {
        id: 103,
        title: "Server-side Rendering with Next.js",
        date: "July 14, 2023",
        excerpt:
          "Learn how to optimize your Next.js application for server-side rendering and improve performance...",
      },
      {
        id: 104,
        title: "A Guide to Next.js Middleware",
        date: "July 21, 2023",
        excerpt:
          "Leverage Next.js Middleware for custom server-side redirects, request modifications, and more...",
      },
    ],
  },
  {
    id: 2,
    issueNumber: 43,
    publishedDate: "July 2023",
    summary:
      "Emphasis on advanced React patterns, state management, plus additional Next.js insights.",
    author: "Jane Doe",
    stories: [
      {
        id: 105,
        title: "Deeper Dive into React Hooks",
        date: "July 10, 2023",
        excerpt:
          "Exploring complex patterns with custom hooks for data fetching, caching, and side effects...",
      },
      {
        id: 106,
        title: "Breaking Down Next.js 13 Features",
        date: "July 11, 2023",
        excerpt:
          "From App Router to Layouts, here's how Next.js 13 changes the way we structure apps...",
      },
    ],
  },
  {
    id: 3,
    issueNumber: 43,
    publishedDate: "July 2023",
    summary:
      "Emphasis on advanced React patterns, state management, plus additional Next.js insights.",
    author: "Jane Doe",
    stories: [
      {
        id: 105,
        title: "Deeper Dive into React Hooks",
        date: "July 10, 2023",
        excerpt:
          "Exploring complex patterns with custom hooks for data fetching, caching, and side effects...",
      },
      {
        id: 106,
        title: "Breaking Down Next.js 13 Features",
        date: "July 11, 2023",
        excerpt:
          "From App Router to Layouts, here's how Next.js 13 changes the way we structure apps...",
      },
    ],
  },
  {
    id: 4,
    issueNumber: 43,
    publishedDate: "July 2023",
    summary:
      "Emphasis on advanced React patterns, state management, plus additional Next.js insights.",
    author: "Jane Doe",
    stories: [
      {
        id: 105,
        title: "Deeper Dive into React Hooks",
        date: "July 10, 2023",
        excerpt:
          "Exploring complex patterns with custom hooks for data fetching, caching, and side effects...",
      },
      {
        id: 106,
        title: "Breaking Down Next.js 13 Features",
        date: "July 11, 2023",
        excerpt:
          "From App Router to Layouts, here's how Next.js 13 changes the way we structure apps...",
      },
    ],
  },
  {
    id: 5,
    issueNumber: 43,
    publishedDate: "July 2023",
    summary:
      "Emphasis on advanced React patterns, state management, plus additional Next.js insights.",
    author: "Jane Doe",
    stories: [
      {
        id: 105,
        title: "Deeper Dive into React Hooks",
        date: "July 10, 2023",
        excerpt:
          "Exploring complex patterns with custom hooks for data fetching, caching, and side effects...",
      },
      {
        id: 106,
        title: "Breaking Down Next.js 13 Features",
        date: "July 11, 2023",
        excerpt:
          "From App Router to Layouts, here's how Next.js 13 changes the way we structure apps...",
      },
    ],
  },
  {
    id: 6,
    issueNumber: 43,
    publishedDate: "July 2023",
    summary:
      "Emphasis on advanced React patterns, state management, plus additional Next.js insights.",
    author: "Jane Doe",
    stories: [
      {
        id: 105,
        title: "Deeper Dive into React Hooks",
        date: "July 10, 2023",
        excerpt:
          "Exploring complex patterns with custom hooks for data fetching, caching, and side effects...",
      },
      {
        id: 106,
        title: "Breaking Down Next.js 13 Features",
        date: "July 11, 2023",
        excerpt:
          "From App Router to Layouts, here's how Next.js 13 changes the way we structure apps...",
      },
    ],
  },
  {
    id: 7,
    issueNumber: 43,
    publishedDate: "July 2023",
    summary:
      "Emphasis on advanced React patterns, state management, plus additional Next.js insights.",
    author: "Jane Doe",
    stories: [
      {
        id: 105,
        title: "Deeper Dive into React Hooks",
        date: "July 10, 2023",
        excerpt:
          "Exploring complex patterns with custom hooks for data fetching, caching, and side effects...",
      },
      {
        id: 106,
        title: "Breaking Down Next.js 13 Features",
        date: "July 11, 2023",
        excerpt:
          "From App Router to Layouts, here's how Next.js 13 changes the way we structure apps...",
      },
    ],
  },
]

export default function StickyIssuesPage() {
  // Example reporter object
  const reporter = { id: "abc123", name: "My Awesome Reporter" }

  // Simple breadcrumb example (you might tailor this if you’re listing multiple issues on the same page)
  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Reporters", href: "/reporters" },
    {
      title: reporter?.name || "New Reporter",
      href: `/reporters/${reporter?.id ?? "new"}`,
    },
    // Possibly a final "Issues" crumb if you prefer:
    { title: "Issues", href: "#" },
  ]

  return (
    <>
      <NavBar breadcrumbs={breadcrumbs} />
      <main className="mx-auto w-full">
        {issues.map((issue) => (
          <Fragment key={issue.id}>
            <section className="md:flex md:gap-6 md:border-zinc-200 dark:md:border-zinc-800 p-12 mx-auto max-w-6xl">
              {/* Left: Sticky side panel */}
              <div className="md:w-72 md:shrink-0 pb-4 px-1">
                <div className="sticky top-28 space-y-3">
                  <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    Issue #{issue.issueNumber}
                  </h1>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Published by {issue.author} on {issue.publishedDate}
                  </p>
                  <p className="mt-4 text-sm text-zinc-700 dark:text-zinc-300">
                    {issue.summary}
                  </p>
                </div>
              </div>

              {/* Right: Scrollable story list */}
              <div className="md:mt-0 md:flex-1">
                <div className="flex flex-col gap-4">
                  {issue.stories.map((story) => (
                    <Link
                      key={story.id}
                      href={`/stories/${story.id}`}
                      className="group"
                    >
                      <Card key={story.id} className="p-4">
                        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50 group-hover:underline">
                          {story.title}
                        </h3>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                          {story.date}
                        </p>
                        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                          {story.excerpt}
                        </p>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
            <Divider className="my-0" />
          </Fragment>
        ))}
      </main>
    </>
  )
}
