import { magicAdmin } from "../../lib/magic";
import { removeTokenCookie } from "../../lib/cookies";
import { verifyToken } from "../../lib/utils";

export default async function logout(req, res) {
  try {
    if (!req.cookies.token)
      return res.status(401).json({ message: "User is not logged in" });
    const token = req.cookies.token;

    const userId = await verifyToken(token);
    console.log("VERIFICATION", userId, token);
    removeTokenCookie(res);
    try {
      await magicAdmin.users.logoutByIssuer(userId);
    } catch (error) {
      console.error("Error occurred while logging out magic user", error);
    }

    res.status(200).json({
      redirect: true,
    });
  } catch (error) {
    console.error({ error });
    res.status(401).json({ message: "User is not logged in" });
  }
}
