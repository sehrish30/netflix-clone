import cookie from "cookie";
import { ResponseCookies } from "@edge-runtime/cookies";

const MAX_AGE = 7 * 24 * 60 * 60;

export const setTokenCookie = (token, res) => {
  const setCookie = cookie.serialize("token", token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  // cookie gets a response to send it to
  res.setHeader("Set-Cookie", setCookie);

  // for lambda runtime
  // https://edge-runtime.vercel.app/packages/cookies
  const cookies = new ResponseCookies(new Headers());
  cookies.set("token", token, { maxAge: MAX_AGE }); // make cookie persistent for 1000 seconds
};

export const removeTokenCookie = (res) => {
  // set cookie of token to empty string
  const val = cookie.serialize("token", "", {
    maxAge: -1,
    path: "/",
  });

  res.setHeader("Set-Cookie", val);
  const cookies = new ResponseCookies(new Headers());
  cookies.delete("token");
};
