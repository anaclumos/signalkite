import type {
  QueryResolvers,
  MutationResolvers,
  CuratedNewsletterRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const curatedNewsletters: QueryResolvers['curatedNewsletters'] = () => {
  return db.curatedNewsletter.findMany()
}

export const curatedNewsletter: QueryResolvers['curatedNewsletter'] = ({
  id,
}) => {
  return db.curatedNewsletter.findUnique({
    where: { id },
  })
}

export const createCuratedNewsletter: MutationResolvers['createCuratedNewsletter'] =
  ({ input }) => {
    return db.curatedNewsletter.create({
      data: input,
    })
  }

export const updateCuratedNewsletter: MutationResolvers['updateCuratedNewsletter'] =
  ({ id, input }) => {
    return db.curatedNewsletter.update({
      data: input,
      where: { id },
    })
  }

export const deleteCuratedNewsletter: MutationResolvers['deleteCuratedNewsletter'] =
  ({ id }) => {
    return db.curatedNewsletter.delete({
      where: { id },
    })
  }

export const CuratedNewsletter: CuratedNewsletterRelationResolvers = {
  Subscription: (_obj, { root }) => {
    return db.curatedNewsletter
      .findUnique({ where: { id: root?.id } })
      .Subscription()
  },
  Content: (_obj, { root }) => {
    return db.curatedNewsletter
      .findUnique({ where: { id: root?.id } })
      .Content()
  },
  User: (_obj, { root }) => {
    return db.curatedNewsletter.findUnique({ where: { id: root?.id } }).User()
  },
}
