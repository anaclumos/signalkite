import type { QueryResolvers, MutationResolvers } from "types/graphql";

import { db } from "src/lib/db";

export const linkSummaries: QueryResolvers["linkSummaries"] = () => {
  return db.linkSummary.findMany();
};

export const linkSummary: QueryResolvers["linkSummary"] = ({ id }) => {
  return db.linkSummary.findUnique({
    where: { id },
  });
};

export const createLinkSummary: MutationResolvers["createLinkSummary"] = ({
  input,
}) => {
  return db.linkSummary.create({
    data: input,
  });
};

export const updateLinkSummary: MutationResolvers["updateLinkSummary"] = ({
  id,
  input,
}) => {
  return db.linkSummary.update({
    data: input,
    where: { id },
  });
};

export const deleteLinkSummary: MutationResolvers["deleteLinkSummary"] = ({
  id,
}) => {
  return db.linkSummary.delete({
    where: { id },
  });
};
