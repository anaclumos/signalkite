// Utility function for mapping reporter strategy identifiers to human-readable labels

/**
 * Converts a strategy identifier into a user-friendly display label
 * @param strategy - The strategy identifier string
 * @returns A human-readable label for the strategy
 */
export function getStrategyLabel(strategy: string) {
  switch (strategy) {
    case "whois-lookup":
      return "Domain Search" // Strategy for domain information lookup
    case "hn-best-stories":
      return "Hacker News Best Stories" // Strategy for fetching top HN stories
    case "exa-search":
      return "Internet Search" // Strategy for general internet searching
    default:
      return "Unknown" // Fallback for unrecognized strategies
  }
}
