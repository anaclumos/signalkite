import { ReporterStrategyType } from "@prisma/client"

export function getStrategyLabel(strategy: ReporterStrategyType) {
  switch (strategy) {
    case "WHOIS_LOOKUP":
      return "Domain Search"
    case "HN_BEST_STORIES":
      return "Hacker News Best Stories"
    case "EXA_SEARCH":
      return "Internet Search"
    default:
      return "Unknown"
  }
}
