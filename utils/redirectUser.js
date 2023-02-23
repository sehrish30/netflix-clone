import { verifyToken } from "../lib/utils";

const redirectUser = (ctx) => {
  //access the token from cookie
  const token = ctx.req?.cookies?.token;
  const userId = verifyToken(token);

  return {
    userId,
    token,
  };
};

export default redirectUser;
