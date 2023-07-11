import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const newsletters: QueryResolvers['newsletters'] = () => {
  return db.newsletter.findMany()
}

export const newsletter: QueryResolvers['newsletter'] = ({ id }) => {
  return db.newsletter.findUnique({
    where: { id },
  })
}

export const createNewsletter: MutationResolvers['createNewsletter'] = ({
  input,
}) => {
  return db.newsletter.create({
    data: input,
  })
}

export const updateNewsletter: MutationResolvers['updateNewsletter'] = ({
  id,
  input,
}) => {
  return db.newsletter.update({
    data: input,
    where: { id },
  })
}

export const deleteNewsletter: MutationResolvers['deleteNewsletter'] = ({
  id,
}) => {
  return db.newsletter.delete({
    where: { id },
  })
}
