import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const outboxes: QueryResolvers['outboxes'] = () => {
  return db.outbox.findMany()
}

export const outbox: QueryResolvers['outbox'] = ({ id }) => {
  return db.outbox.findUnique({
    where: { id },
  })
}

export const createOutbox: MutationResolvers['createOutbox'] = ({ input }) => {
  return db.outbox.create({
    data: input,
  })
}

export const updateOutbox: MutationResolvers['updateOutbox'] = ({
  id,
  input,
}) => {
  return db.outbox.update({
    data: input,
    where: { id },
  })
}

export const deleteOutbox: MutationResolvers['deleteOutbox'] = ({ id }) => {
  return db.outbox.delete({
    where: { id },
  })
}
