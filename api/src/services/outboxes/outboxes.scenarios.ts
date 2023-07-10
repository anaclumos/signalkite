import type { Prisma, Outbox } from "@prisma/client";
import type { ScenarioData } from "@redwoodjs/testing/api";

export const standard = defineScenario<Prisma.OutboxCreateArgs>({
  outbox: {
    one: {
      data: {
        contentId: 9274757,
        subscriptionId: 3094541,
        status: "String",
        updatedAt: "2023-07-10T22:12:25.793Z",
      },
    },
    two: {
      data: {
        contentId: 6948792,
        subscriptionId: 2106361,
        status: "String",
        updatedAt: "2023-07-10T22:12:25.793Z",
      },
    },
  },
});

export type StandardScenario = ScenarioData<Outbox, "outbox">;
