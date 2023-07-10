import type { Prisma, User } from "@prisma/client";
import type { ScenarioData } from "@redwoodjs/testing/api";

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        username: "String2190484",
        email: "String9538506",
        timezone: "String",
        updatedAt: "2023-07-10T22:11:16.996Z",
      },
    },
    two: {
      data: {
        username: "String2019321",
        email: "String5364548",
        timezone: "String",
        updatedAt: "2023-07-10T22:11:16.996Z",
      },
    },
  },
});

export type StandardScenario = ScenarioData<User, "user">;
