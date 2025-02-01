import { cx } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cx("animate-spin", className)} />
}
