import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const summaries: QueryResolvers['summaries'] = () => {
  return db.summary.findMany()
}

export const summary: QueryResolvers['summary'] = ({ id }) => {
  return db.summary.findUnique({
    where: { id },
  })
}

export const createSummary: MutationResolvers['createSummary'] = ({
  input,
}) => {
  return db.summary.create({
    data: input,
  })
}

export const updateSummary: MutationResolvers['updateSummary'] = ({
  id,
  input,
}) => {
  return db.summary.update({
    data: input,
    where: { id },
  })
}

export const deleteSummary: MutationResolvers['deleteSummary'] = ({ id }) => {
  return db.summary.delete({
    where: { id },
  })
}
