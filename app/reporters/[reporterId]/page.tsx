import { getReporter } from "@/app/actions/reporters"
import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Divider } from "@/components/ui/divider"
import Link from "next/link"
import { Fragment } from "react"

export default async function ReporterPage({
  params,
}: { params: { reporterId: string } }) {
  const reporter = await getReporter(params.reporterId)

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Reporters", href: "/reporters" },
    { title: reporter.name, href: `/reporters/${reporter.id}` },
  ]

  return (
    <>
      <NavBar
        breadcrumbs={breadcrumbs}
        actions={
          <Button type="submit" variant={"primary"}>
            {"Subscribe"}
          </Button>
        }
      />
      <main className="mx-auto w-full">
        {reporter.Issues.map((issue) => (
          <Fragment key={issue.id}>
            <section className="md:flex md:gap-6 md:border-zinc-200 dark:md:border-zinc-800 p-12 mx-auto max-w-6xl">
              {/* Left: Sticky side panel */}
              <div className="md:w-72 md:shrink-0 pb-4 px-1">
                <div className="sticky top-28 space-y-3">
                  <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                      {issue.title}
                    </h1>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {issue.createdAt.toString()}
                  </p>
                  <p className="mt-4 text-sm text-zinc-700 dark:text-zinc-300">
                    {issue.description}
                  </p>
                </div>
              </div>

              {/* Right: Scrollable story list */}
              <div className="md:mt-0 md:flex-1">
                <div className="flex flex-col gap-4">
                  {issue.Stories.map((story) => (
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
                          {story.summary}
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
