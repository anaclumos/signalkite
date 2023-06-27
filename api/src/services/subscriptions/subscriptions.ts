import type {
  QueryResolvers,
  MutationResolvers,
  SubscriptionRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const subscriptions: QueryResolvers['subscriptions'] = () => {
  return db.subscription.findMany()
}

export const subscription: QueryResolvers['subscription'] = ({ id }) => {
  return db.subscription.findUnique({
    where: { id },
  })
}

export const createSubscription: MutationResolvers['createSubscription'] = ({
  input,
}) => {
  return db.subscription.create({
    data: input,
  })
}

export const updateSubscription: MutationResolvers['updateSubscription'] = ({
  id,
  input,
}) => {
  return db.subscription.update({
    data: input,
    where: { id },
  })
}

export const deleteSubscription: MutationResolvers['deleteSubscription'] = ({
  id,
}) => {
  return db.subscription.delete({
    where: { id },
  })
}

export const Subscription: SubscriptionRelationResolvers = {
  User: (_obj, { root }) => {
    return db.subscription.findUnique({ where: { id: root?.id } }).User()
  },
  CuratedNewsletter: (_obj, { root }) => {
    return db.subscription
      .findUnique({ where: { id: root?.id } })
      .CuratedNewsletter()
  },
  CustomNewsletter: (_obj, { root }) => {
    return db.subscription
      .findUnique({ where: { id: root?.id } })
      .CustomNewsletter()
  },
  Outbox: (_obj, { root }) => {
    return db.subscription.findUnique({ where: { id: root?.id } }).Outbox()
  },
}
