import { Router } from "express";
import {
  showAllBatch,
  teacherInfo,
  updatePasswordTeacher,
} from "../controllers/teacherController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isAuthorizedTeacher } from "../middleware/isAuthorized.js";

export let teacherRouter = Router();
// teacherRouter.route("/login").post(loginTeacher)
// teacherRouter.route("/logout").get(isAuthenticated,isAuthorizedTeacher,logoutTeacher)
teacherRouter
  .route("/batch")
  .get(isAuthenticated, isAuthorizedTeacher, showAllBatch);
teacherRouter
  .route("/update-password")
  .post(isAuthenticated, isAuthorizedTeacher, updatePasswordTeacher);
teacherRouter
  .route("/info")
  .get(isAuthenticated, isAuthorizedTeacher, teacherInfo);
