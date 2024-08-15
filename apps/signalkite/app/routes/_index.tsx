import type { MetaFunction } from "@remix-run/node"

export const meta: MetaFunction = () => {
  return [
    { title: "SignalKite" },
    {
      name: "description",
      content:
        "SignalKite is a platform for organizing intentful information flows.",
    },
  ]
}

export default function Index() {
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">SignalKite</h1>
    </div>
  )
}
