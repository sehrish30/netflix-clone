// import jwt from "jsonwebtoken";

// export const verifyToken = (token) => {
//   if (token) {
//     const decodedToken = j\wt.verify(token, process.env.NEXT_PUBLIC_HASURA_JWT_SECRET);
//     return decodedToken.issuer;
//   }
//   return null;
// };

import { jwtVerify } from "jose";

export const verifyToken = async (token) => {
  if (token) {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.NEXT_PUBLIC_HASURA_JWT_SECRET)
    );

    return verified.payload && verified.payload?.issuer;
  }
  return null;
};
