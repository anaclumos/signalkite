import { OnboardingCard } from "@/components/onboarding-card"

export default async function Page() {
  return (
    <OnboardingCard
      title="Marketplace"
      caption="Discover and subscribe to public reporters hired by other users. Browse through a collection of reporters and find the ones that match your interests."
      data={[
        {
          title: "Popular Reporters",
          description:
            "Explore trending reporters with the most subscribers and highest activity.",
          linkText: "Browse Popular",
          href: "/marketplace/popular",
        },
        {
          title: "New Arrivals",
          description:
            "Check out recently published reporters and be among the first to subscribe.",
          linkText: "See What's New",
          href: "/marketplace/new",
        },
        {
          title: "Categories",
          description:
            "Browse reporters by category to find exactly what you're looking for.",
          linkText: "View Categories",
          href: "/marketplace/categories",
        },
      ]}
    />
  )
}
