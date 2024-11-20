import jwt from "jsonwebtoken";
import { SECRETKEY } from "../config/constant.js";
import { Token } from "../schema/model.js";
export let verifyToken = async (token) => {
  let infoObj = await jwt.verify(token, SECRETKEY);
  return infoObj;
};

export let generateToken = async (infoObj, expireInfo) => {
  let token = await jwt.sign(infoObj, SECRETKEY, expireInfo);

  return token;
};

export let removeExpiredToken = () => {
  setInterval(async () => {
    let allToken = await Token.find({});
    allToken.forEach(async (element) => {
      // console.log(element, "element................");
      // let test = await verifyToken(element.token);
      // if (test.exp < new Date().getTime()) {
      //   await Token.findByIdAndDelete(test.id, { new: true });
      // }
    });
  }, 1);
};
