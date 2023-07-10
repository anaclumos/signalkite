import type { Prisma, User } from "@prisma/client";
import type { ScenarioData } from "@redwoodjs/testing/api";

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        timezone: "String",
        updatedAt: "2023-07-10T22:33:16.357Z",
        username: "String5229575",
        email: "String3495383",
        hashedPassword: "String",
        salt: "String",
      },
    },
    two: {
      data: {
        timezone: "String",
        updatedAt: "2023-07-10T22:33:16.357Z",
        username: "String3425501",
        email: "String4892139",
        hashedPassword: "String",
        salt: "String",
      },
    },
  },
});

export type StandardScenario = ScenarioData<User, "user">;
