export function getStrategyLabel(strategy: string) {
  switch (strategy) {
    case "whois-lookup":
      return "Domain Search"
    case "hn-best-stories":
      return "Hacker News Best Stories"
    case "exa-search":
      return "Internet Search"
    default:
      return "Unknown"
  }
}
