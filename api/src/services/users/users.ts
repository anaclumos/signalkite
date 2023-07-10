import type { QueryResolvers, MutationResolvers } from "types/graphql";
import CryptoJS from 'crypto-js'

import { db } from "src/lib/db";
import { UserInputError } from "@redwoodjs/graphql-server";

export const users: QueryResolvers["users"] = () => {
  return db.user.findMany();
};

export const user: QueryResolvers["user"] = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  });
};

export const createUser: MutationResolvers["createUser"] = ({ input }) => {
  return db.user.create({
    data: input,
  });
};

export const updateUser: MutationResolvers["updateUser"] = ({ id, input }) => {
  return db.user.update({
    data: input,
    where: { id },
  });
};

export const deleteUser: MutationResolvers["deleteUser"] = ({ id }) => {
  return db.user.delete({
    where: { id },
  });
};


export const generateLoginToken = async ({ email }) => {
  try {
    // look up if the user exists
    let lookupUser = await db.user.findFirst({ where: { email } })
    if (!lookupUser) return { message: 'Login Request received' }
    // here we're going to generate a random password of 6 numbers
    let randomNumber = (() => {
      let random = CryptoJS.lib.WordArray.random(6)
      let randomString = random.toString()
      let sixDigitNumber = randomString.replace(/\D/g, '')
      if (sixDigitNumber.length < 6) {
        sixDigitNumber = sixDigitNumber.padStart(6, '0')
      }
      if (sixDigitNumber.length > 6) {
        sixDigitNumber = sixDigitNumber.slice(0, 6)
      }
      return sixDigitNumber.toString()
    })()
    console.log({ randomNumber }) // email the user this number
    let salt = CryptoJS.lib.WordArray.random(30)
    let loginToken = CryptoJS.PBKDF2(randomNumber, salt, {
      keySize: 256 / 32,
    }).toString()
    // now we'll update the user with the new salt and loginToken
    let loginTokenExpiresAt = new Date()
    loginTokenExpiresAt.setMinutes(loginTokenExpiresAt.getMinutes() + 15)
    let data = {
        salt,
        loginToken,
        loginTokenExpiresAt,
    }
    await db.user.update({
      where: { id: lookupUser.id },
      data
    })

    return { message: 'Login Request received' }
  } catch (error) {
    console.log({ error })
    throw new UserInputError(error.message)
  }
}
