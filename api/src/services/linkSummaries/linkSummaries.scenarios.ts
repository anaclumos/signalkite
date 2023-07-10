import type { Prisma, LinkSummary } from "@prisma/client";
import type { ScenarioData } from "@redwoodjs/testing/api";

export const standard = defineScenario<Prisma.LinkSummaryCreateArgs>({
  linkSummary: {
    one: {
      data: {
        title: "String",
        linkUrl: "String4680457",
        BCP47: "String",
        updatedAt: "2023-07-10T22:12:28.096Z",
      },
    },
    two: {
      data: {
        title: "String",
        linkUrl: "String6209120",
        BCP47: "String",
        updatedAt: "2023-07-10T22:12:28.096Z",
      },
    },
  },
});

export type StandardScenario = ScenarioData<LinkSummary, "linkSummary">;
