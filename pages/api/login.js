// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { magicAdmin } from "../../lib/magic-server";
import jwt from "jsonwebtoken";
import { createNewUser, isNewUser } from "../../lib/db/hasura";
import { setTokenCookie } from "../../lib/cookies";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const auth = req.headers.authorization;
    const DIDToken = auth ? auth.substr(7) : "";

    // get the did token and get user meta data from magic
    const metadata = await magicAdmin.users.getMetadataByToken(DIDToken);

    // create jwt
    const token = jwt.sign(
      {
        ...metadata,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["admin", "user"],
          "x-hasura-default-role": "user",
          "x-hasura-user-id": `${metadata.issuer}`,
        },
      },
      process.env.HASURA_JWT_SECRET
    );

    // check if user exists
    const isNewUserQuery = await isNewUser(token, metadata.issuer);

    // set a cookie
    setTokenCookie(token, res);

    isNewUserQuery && (await createNewUser(token, metadata));

    try {
      res.status(200).json({ done: true });
    } catch (err) {
      res.status(500).send({ msg: err });
    }
  } else {
    res.send({ done: false });
  }
}
