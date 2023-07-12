import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const newsletterContents: QueryResolvers['newsletterContents'] = () => {
  return db.newsletterContent.findMany()
}

export const newsletterContent: QueryResolvers['newsletterContent'] = ({
  id,
}) => {
  return db.newsletterContent.findUnique({
    where: { id },
  })
}

export const createNewsletterContent: MutationResolvers['createNewsletterContent'] =
  ({ input }) => {
    return db.newsletterContent.create({
      data: input,
    })
  }

export const updateNewsletterContent: MutationResolvers['updateNewsletterContent'] =
  ({ id, input }) => {
    return db.newsletterContent.update({
      data: input,
      where: { id },
    })
  }

export const deleteNewsletterContent: MutationResolvers['deleteNewsletterContent'] =
  ({ id }) => {
    return db.newsletterContent.delete({
      where: { id },
    })
  }
