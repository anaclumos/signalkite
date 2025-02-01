import { OnboardingCard } from "@/components/onboarding-card"

export default function Page() {
  return (
    <OnboardingCard
      title="Welcome to your Dashboard"
      caption="This is a high-level overview of the user's Kites, recent Stories, active Subscriptions, and upcoming Schedules."
      data={[
        {
          title: "Recent Stories",
          description:
            "View newly discovered Stories from your Kites and subscriptions.",
          linkText: "View Stories",
          href: "/stories",
        },
        {
          title: "Your Stats",
          description:
            "See your Kites, active Subscriptions, and upcoming Schedules at a glance.",
          linkText: "View Dashboard",
          href: "/dashboard",
        },
        {
          title: "Quick Actions",
          description:
            "Create a new Kite, explore the Marketplace, or manage your Subscriptions.",
          linkText: "Get Started",
          href: "/actions",
        },
      ]}
    />
  )
}
