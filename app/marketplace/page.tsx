import { OnboardingCard } from "@/components/onboarding-card"

export default function Page() {
  return (
    <OnboardingCard
      title="Marketplace"
      caption="Discover and subscribe to public Kites created by other users. Browse through a collection of Kites and find the ones that match your interests."
      data={[
        {
          title: "Popular Kites",
          description:
            "Explore trending Kites with the most subscribers and highest activity.",
          linkText: "Browse Popular",
          href: "/marketplace/popular",
        },
        {
          title: "New Arrivals",
          description:
            "Check out recently published Kites and be among the first to subscribe.",
          linkText: "See What's New",
          href: "/marketplace/new",
        },
        {
          title: "Categories",
          description:
            "Browse Kites by category to find exactly what you're looking for.",
          linkText: "View Categories",
          href: "/marketplace/categories",
        },
      ]}
    />
  )
}
