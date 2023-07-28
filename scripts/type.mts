export type Story = {
  id: string
  title: string
  originLink: string
  originBody?: string
  commentLink?: string
  commentBody?: string
  originSummary?: string[]
  commentSummary?: string[]
  points?: number
  commentCount?: number
  downloadMethod?: string
  retryCount?: number
  time?: number
}
