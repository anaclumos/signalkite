import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const contents: QueryResolvers['contents'] = () => {
  return db.content.findMany()
}

export const content: QueryResolvers['content'] = ({ id }) => {
  return db.content.findUnique({
    where: { id },
  })
}

export const createContent: MutationResolvers['createContent'] = ({
  input,
}) => {
  return db.content.create({
    data: input,
  })
}

export const updateContent: MutationResolvers['updateContent'] = ({
  id,
  input,
}) => {
  return db.content.update({
    data: input,
    where: { id },
  })
}

export const deleteContent: MutationResolvers['deleteContent'] = ({ id }) => {
  return db.content.delete({
    where: { id },
  })
}
