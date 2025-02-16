import { faker } from "@faker-js/faker"
import {
  PrismaClient,
  ReporterStatus,
  ReporterStrategyType,
} from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // DROP ALL
  await prisma.story.deleteMany()
  await prisma.issue.deleteMany()
  await prisma.reporter.deleteMany()
  await prisma.user.deleteMany()

  // Create a test user first with a unique authProviderUid
  const user = await prisma.user.create({
    data: {
      authProviderUid: process.env.SEED_TEST_USER || "seed-test-user",
      lastLogin: new Date(),
    },
  })

  // Create 3 reporters
  const reporters = await Promise.all(
    Array(3)
      .fill(null)
      .map(async (_, index) => {
        return prisma.reporter.create({
          data: {
            name: faker.book.series(),
            description: faker.lorem.paragraph(),
            strategy: faker.helpers.arrayElement(
              Object.values(ReporterStrategyType),
            ),
            status: ReporterStatus.ACTIVE,
            creatorId: user.id,
          },
        })
      }),
  )

  // For each reporter, create 10 issues
  for (const reporter of reporters) {
    await Promise.all(
      Array(10)
        .fill(null)
        .map(async (_, issueIndex) => {
          const issue = await prisma.issue.create({
            data: {
              title: faker.book.title(),
              description: faker.lorem.paragraph(),
              reporterId: reporter.id,
              successful: true,
            },
          })

          // For each issue, create 4-6 stories
          const storyCount = faker.number.int({ min: 4, max: 6 })
          await Promise.all(
            Array(storyCount)
              .fill(null)
              .map(async (_, storyIndex) => {
                return prisma.story.create({
                  data: {
                    title: faker.lorem.sentence(),
                    url: faker.internet.url(),
                    summary: faker.lorem.paragraph(),
                    issueId: issue.id,
                    reporterId: reporter.id,
                  },
                })
              }),
          )
        }),
    )
  }

  console.log("Seed data created successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
