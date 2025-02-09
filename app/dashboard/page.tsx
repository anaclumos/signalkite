import { OnboardingCard } from "@/components/onboarding-card"

export default function Page() {
  return (
    <OnboardingCard
      title="Welcome to your Dashboard"
      caption="This is a high-level overview of reporters that you hired, recent Stories, active Subscriptions, and upcoming Schedules."
      data={[
        {
          title: "Recent Stories",
          description:
            "View newly discovered Stories from your reporters and subscriptions.",
          linkText: "View Stories",
          href: "/stories",
        },
        {
          title: "Your Stats",
          description:
            "See your reporters, active Subscriptions, and upcoming Schedules at a glance.",
          linkText: "View Dashboard",
          href: "/dashboard",
        },
        {
          title: "Quick Actions",
          description:
            "Hire a new Reporter, explore the Marketplace, or manage your Subscriptions.",
          linkText: "Hire a Reporter",
          href: "/marketplace",
        },
      ]}
    />
  )
}
