import {
  findVideoIdByUser,
  updateStats,
  insertStats,
} from "../../lib/db/hasura";

import { redirectUserReq } from "../../utils/redirectUser";

export default async function statsHandler(req, res) {
  try {
    const { userId, token } = await redirectUserReq(req);
    const { videoId } = req.method === "POST" ? req.body : req.query;

    if (!videoId) {
      return res.status(400).json({
        message: "Video id missing",
      });
    }
    const findVideo = await findVideoIdByUser(token, userId, videoId);
    const doesStatsExist = findVideo?.length > 0;

    if (req.method === "POST") {
      /**
       * req.cookies.token
       * backend is goinf to pick this automatically
       * from the browser so we dont need to send anything in our api
       */
      const { favourited, watched = true } = req.body;
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
    } else {
      if (doesStatsExist) {
        return res.send(findVideo);
      } else {
        return res.status(404).send({
          user: null,
          msg: "Video not found",
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      done: false,
      error: err,
    });
  }
}

//   if (req.method === "POST") {
//     try {
//       res.status(200).json({ videoDetails });
//     } catch (err) {
//       res.status(500).json({
//         done: false,
//         error: err,
//       });
//     }
//   } else {
//     try {
//       const token = req.cookies.token;

//       if (!token) {
//         return res.status(403).json({
//           message: "Not authenticated",
//         });
//       }

//       const decodedToken = jwt.verify(token, process.env.NEXT_PUBLIC_HASURA_JWT_SECRET);
//       const userId = decodedToken.issuer;
//       const { videoId } = req.body;

//       if (!videoId) {
//         return res.status(400).json({
//           message: "Video id missing",
//         });
//       }
//       const findVideo = await findVideoIdByUser(token, userId, videoId);

//       const doesStatsExist = findVideo?.length > 0;
//       if (doesStatsExist) {
//         return res.send(findVideo);
//       } else {
//         return res.status(404).send({
//           user: null,
//           msg: "Video not found",
//         });
//       }

//       res.status(200).json({ videoDetails });
//     } catch (err) {
//       res.status(500).json({
//         done: false,
//         error: err,
//       });
//     }
//   }
// }
