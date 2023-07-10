import type { Prisma, Subscription } from "@prisma/client";
import type { ScenarioData } from "@redwoodjs/testing/api";

export const standard = defineScenario<Prisma.SubscriptionCreateArgs>({
  subscription: {
    one: {
      data: {
        userId: 6881014,
        frequency: "String",
        time: "String",
        length: "String",
        BCP47: "String",
        updatedAt: "2023-07-10T22:12:18.685Z",
      },
    },
    two: {
      data: {
        userId: 8211421,
        frequency: "String",
        time: "String",
        length: "String",
        BCP47: "String",
        updatedAt: "2023-07-10T22:12:18.685Z",
      },
    },
  },
});

export type StandardScenario = ScenarioData<Subscription, "subscription">;
