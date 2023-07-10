import type { Newsletter } from "@prisma/client";

import {
  newsletters,
  newsletter,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
} from "./newsletters";
import type { StandardScenario } from "./newsletters.scenarios";

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe("newsletters", () => {
  scenario("returns all newsletters", async (scenario: StandardScenario) => {
    const result = await newsletters();

    expect(result.length).toEqual(Object.keys(scenario.newsletter).length);
  });

  scenario(
    "returns a single newsletter",
    async (scenario: StandardScenario) => {
      const result = await newsletter({ id: scenario.newsletter.one.id });

      expect(result).toEqual(scenario.newsletter.one);
    }
  );

  scenario("creates a newsletter", async () => {
    const result = await createNewsletter({
      input: {
        publicNewsletterHandle: "String9800290",
        newsletterName: "String",
        keyword: "String",
        targetRegion: "String",
        userId: 5557880,
        updatedAt: "2023-07-10T22:12:16.313Z",
      },
    });

    expect(result.publicNewsletterHandle).toEqual("String9800290");
    expect(result.newsletterName).toEqual("String");
    expect(result.keyword).toEqual("String");
    expect(result.targetRegion).toEqual("String");
    expect(result.userId).toEqual(5557880);
    expect(result.updatedAt).toEqual(new Date("2023-07-10T22:12:16.313Z"));
  });

  scenario("updates a newsletter", async (scenario: StandardScenario) => {
    const original = (await newsletter({
      id: scenario.newsletter.one.id,
    })) as Newsletter;
    const result = await updateNewsletter({
      id: original.id,
      input: { publicNewsletterHandle: "String9496342" },
    });

    expect(result.publicNewsletterHandle).toEqual("String9496342");
  });

  scenario("deletes a newsletter", async (scenario: StandardScenario) => {
    const original = (await deleteNewsletter({
      id: scenario.newsletter.one.id,
    })) as Newsletter;
    const result = await newsletter({ id: original.id });

    expect(result).toEqual(null);
  });
});
