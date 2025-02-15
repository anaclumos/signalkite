import { useFormStatus } from "react-dom"
import { Button } from "./ui/button"

export function SubmitButton({
  defaultLabel,
  submittingLabel,
}: {
  defaultLabel?: string
  submittingLabel?: string
}) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? submittingLabel || "Saving..." : defaultLabel || "Save"}
    </Button>
  )
}
