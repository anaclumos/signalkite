import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { Link } from "@/components/link"
import { useLoaderData } from "@remix-run/react"

export const meta: MetaFunction = () => {
  return [
    { title: "Kites" },
    { name: "description", content: "Welcome to Remix!" },
  ]
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return params
}

export default function Index() {
  const params = useLoaderData<typeof loader>()
  return (
    <div className="font-sans p-4">
      Kite {params.id}
      <ul className="list-disc mt-4 pl-6 space-y-2">
        <li>
          <Link href="/kites">All Kites</Link>
        </li>
        <li>
          <Link href="/kites/1">Kite 1</Link>
        </li>
        <li>
          <Link href="/kites/2">Kite 2</Link>
        </li>
      </ul>
    </div>
  )
}
