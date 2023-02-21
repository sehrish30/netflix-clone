import jwt from "jsonwebtoken";
import {
  findVideoIdByUser,
  updateStats,
  insertStats,
} from "../../lib/db/hasura";

export default async function statsHandler(req, res) {
  if (req.method === "POST") {
    /**
     * req.cookies.token
     * backend is goinf to pick this automatically
     * from the browser so we dont need to send anything in our api
     */
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(403).json({
          message: "Not authenticated",
        });
      }

      const decodedToken = jwt.verify(token, process.env.HASURA_JWT_SECRET);
      const userId = decodedToken.issuer;
      const { videoId, favourited, watched = true } = req.body;

      if(!videoId){
        return res.status(400).json({
            message: "Video id missing"
        })
      }
      const doesStatsExist = await findVideoIdByUser(token, userId, videoId);

      if (doesStatsExist) {
        // update it
        const response = await updateStats(token, {
          watched,
          userId,
          videoId,
          favourited,
        });
        return res.send({
          updatedStats: response,
        });
      } else {
        // add it
        const response = await insertStats(token, {
          watched,
          userId,
          videoId,
          favourited,
        });
        return res.send({
          updatedStats: response,
        });
      }

      res.status(200).json({ videoDetails });
    } catch (err) {
      res.status(500).json({
        done: false,
        error: err,
      });
    }
  }
}
