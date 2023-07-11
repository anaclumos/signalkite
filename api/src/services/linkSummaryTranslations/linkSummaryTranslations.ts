import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const linkSummaryTranslations: QueryResolvers['linkSummaryTranslations'] =
  () => {
    return db.linkSummaryTranslation.findMany()
  }

export const linkSummaryTranslation: QueryResolvers['linkSummaryTranslation'] =
  ({ id }) => {
    return db.linkSummaryTranslation.findUnique({
      where: { id },
    })
  }

export const createLinkSummaryTranslation: MutationResolvers['createLinkSummaryTranslation'] =
  ({ input }) => {
    return db.linkSummaryTranslation.create({
      data: input,
    })
  }

export const updateLinkSummaryTranslation: MutationResolvers['updateLinkSummaryTranslation'] =
  ({ id, input }) => {
    return db.linkSummaryTranslation.update({
      data: input,
      where: { id },
    })
  }

export const deleteLinkSummaryTranslation: MutationResolvers['deleteLinkSummaryTranslation'] =
  ({ id }) => {
    return db.linkSummaryTranslation.delete({
      where: { id },
    })
  }
