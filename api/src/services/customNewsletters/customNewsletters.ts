import type {
  QueryResolvers,
  MutationResolvers,
  CustomNewsletterRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const customNewsletters: QueryResolvers['customNewsletters'] = () => {
  return db.customNewsletter.findMany()
}

export const customNewsletter: QueryResolvers['customNewsletter'] = ({
  id,
}) => {
  return db.customNewsletter.findUnique({
    where: { id },
  })
}

export const createCustomNewsletter: MutationResolvers['createCustomNewsletter'] =
  ({ input }) => {
    return db.customNewsletter.create({
      data: input,
    })
  }

export const updateCustomNewsletter: MutationResolvers['updateCustomNewsletter'] =
  ({ id, input }) => {
    return db.customNewsletter.update({
      data: input,
      where: { id },
    })
  }

export const deleteCustomNewsletter: MutationResolvers['deleteCustomNewsletter'] =
  ({ id }) => {
    return db.customNewsletter.delete({
      where: { id },
    })
  }

export const CustomNewsletter: CustomNewsletterRelationResolvers = {
  Subscription: (_obj, { root }) => {
    return db.customNewsletter
      .findUnique({ where: { id: root?.id } })
      .Subscription()
  },
  Content: (_obj, { root }) => {
    return db.customNewsletter.findUnique({ where: { id: root?.id } }).Content()
  },
  User: (_obj, { root }) => {
    return db.customNewsletter.findUnique({ where: { id: root?.id } }).User()
  },
}
