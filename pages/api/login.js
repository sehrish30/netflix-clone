import { magicAdmin } from "../../lib/magic-server";
// import jwt from "jsonwebtoken";
import { createNewUser, isNewUser } from "../../lib/db/hasura";
import { setTokenCookie } from "../../lib/cookies";
import { SignJWT } from "jose";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const auth = req.headers.authorization;
    const DIDToken = auth ? auth.substr(7) : "";

    try {
      // get the did token and get user meta data from magic
      const metadata = await magicAdmin.users.getMetadataByToken(DIDToken);

      const secret = new TextEncoder().encode(process.env.HASURA_JWT_SECRET);

      // create jwt
      const token = await new SignJWT({
        ...metadata,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["admin", "user"],
          "x-hasura-default-role": "user",
          "x-hasura-user-id": `${metadata.issuer}`,
        },
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        // .setIssuer("urn:example:issuer")
        // .setAudience("urn:example:audience")
        .setExpirationTime("2h")
        .sign(secret);
      // const token = jwt.sign(
      //   {
      //     ...metadata,
      //     iat: Math.floor(Date.now() / 1000),
      //     exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
      //     "https://hasura.io/jwt/claims": {
      //       "x-hasura-allowed-roles": ["admin", "user"],
      //       "x-hasura-default-role": "user",
      //       "x-hasura-user-id": `${metadata.issuer}`,
      //     },
      //   },
      //   process.env.HASURA_JWT_SECRET
      // );

      // check if user exists
      const isNewUserQuery = await isNewUser(token, metadata.issuer);

      // set a cookie
      setTokenCookie(token, res);

      isNewUserQuery && (await createNewUser(token, metadata));

      res.status(200).json({ done: true });
    } catch (err) {
      res.status(500).send({ msg: err });
    }
  } else {
    res.send({ done: false });
  }
}
