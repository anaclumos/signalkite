import { Callout } from "@/components/ui/callout"

interface ErrorStatusProps {
  title: string
  message: string
}

export function ErrorStatus({ title, message }: ErrorStatusProps) {
  return (
    <Callout variant="error" title={title}>
      {message}
    </Callout>
  )
}
