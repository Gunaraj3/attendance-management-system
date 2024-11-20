import expressAsyncHandler from "express-async-handler";
import { Token } from "../schema/model.js";
import { verifyToken } from "../utils/token.js";
export let isAuthenticated = expressAsyncHandler(async (req, res, next) => {
  let bearerTokenStr = req.headers["authorization"];

  if (bearerTokenStr === undefined) {
    let error = new Error("User must have a valid token");
    error.statusCode = 401;
    throw error;
  }
  let tokenArr = bearerTokenStr.split(" ");

  let token = tokenArr[1];
  let tokenAtDatabase = await Token.findOne({ token });

  if (!tokenAtDatabase) {
    let error = new Error("Token is not valid");
    error.statusCode = 401;
    throw error;
  } else {
    let info = await verifyToken(token);
    // console.log("info.............", info);
    req.body.info = info;
    req.body.token = {
      token,
      tokenId: tokenAtDatabase._id,
    };

    next();
  }
});
