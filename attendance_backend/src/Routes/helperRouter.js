import { Router } from "express";
import {
  TokenVerification,
  login,
  logout,
} from "../controllers/helperController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

import expressAsyncHandler from "express-async-handler";
import { Admin, Student, Teacher, Token } from "../schema/model.js";
import { errorResponse } from "../helper/errorResponse.js";
import { comparePassword } from "../utils/Hashing.js";
import { generateToken, verifyToken } from "../utils/token.js";
import { successResponse } from "../helper/successResponse.js";
import { HttpStatus } from "../config/constant.js";

export let helperRouter = Router();
helperRouter.route("/login").post(login);
helperRouter.route("/verifyToken").get(TokenVerification);
helperRouter.route("/logout").get(isAuthenticated, logout);
