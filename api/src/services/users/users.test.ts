import type { User } from "@prisma/client";

import { users, user, createUser, updateUser, deleteUser } from "./users";
import type { StandardScenario } from "./users.scenarios";

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe("users", () => {
  scenario("returns all users", async (scenario: StandardScenario) => {
    const result = await users();

    expect(result.length).toEqual(Object.keys(scenario.user).length);
  });

  scenario("returns a single user", async (scenario: StandardScenario) => {
    const result = await user({ id: scenario.user.one.id });

    expect(result).toEqual(scenario.user.one);
  });

  scenario("creates a user", async () => {
    const result = await createUser({
      input: {
        username: "String2309282",
        email: "String788733",
        timezone: "String",
        updatedAt: "2023-07-10T22:11:16.977Z",
      },
    });

    expect(result.username).toEqual("String2309282");
    expect(result.email).toEqual("String788733");
    expect(result.timezone).toEqual("String");
    expect(result.updatedAt).toEqual(new Date("2023-07-10T22:11:16.977Z"));
  });

  scenario("updates a user", async (scenario: StandardScenario) => {
    const original = (await user({ id: scenario.user.one.id })) as User;
    const result = await updateUser({
      id: original.id,
      input: { username: "String73331382" },
    });

    expect(result.username).toEqual("String73331382");
  });

  scenario("deletes a user", async (scenario: StandardScenario) => {
    const original = (await deleteUser({ id: scenario.user.one.id })) as User;
    const result = await user({ id: original.id });

    expect(result).toEqual(null);
  });
});
