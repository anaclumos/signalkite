export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col overflow-y-auto">{children}</div>
  )
}
