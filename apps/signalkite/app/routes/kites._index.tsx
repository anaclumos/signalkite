import type { MetaFunction } from "@remix-run/node"
import { Link } from "@/components/link"

export const meta: MetaFunction = () => {
  return [
    { title: "Kites" },
    { name: "description", content: "Welcome to Remix!" },
  ]
}

export default function Index() {
  return (
    <div className="font-sans p-4">
      Kites
      <ul className="list-disc mt-4 pl-6 space-y-2">
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
