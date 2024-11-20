import { Router } from "express";
import {
  addAdmin,
  addBatch,
  addStudent,
  addTeacher,
  adminInfo,
  assignTeacher,
  deleteAdmin,
  deleteStudent,
  deleteTeacher,
  getAdmin,
  getBatch,
  getBatchDetails,
  getBatchStudent,
  getBatchTeacher,
  getStudent,
  getStudentDetail,
  getTeacher,
  getTeacherDetail,
  insertStudent,
  unAssignStudent,
  unAssignTeacher,
  updateAdmin,
  updateCourse,
  updatePasswordAdmin,
  updateStudent,
  updateTeacher,
} from "../controllers/adminController.js";
import { isAuthorizedAdmin } from "../middleware/isAuthorized.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

let adminRouter = Router();

// adminRouter.route("/logout").get(isAuthenticated, isAuthorizedAdmin, logout)
adminRouter.route("/add").post(isAuthenticated, isAuthorizedAdmin, addAdmin);
adminRouter.route("/all").get(isAuthenticated, isAuthorizedAdmin, getAdmin);
adminRouter.route("/:adminId").put(isAuthenticated, isAuthorizedAdmin, updateAdmin);
adminRouter.route("/:deleteId").delete(isAuthenticated, isAuthorizedAdmin, deleteAdmin);
//Batch operation
adminRouter
  .route("/batch")
  .get(isAuthenticated, isAuthorizedAdmin, getBatch)
  .post(isAuthenticated, isAuthorizedAdmin, addBatch);
  
adminRouter
  .route("/batch/:batchId")
  .get(isAuthenticated, isAuthorizedAdmin, getBatchDetails)
  .put(isAuthenticated, isAuthorizedAdmin, updateCourse);

//Teacher
adminRouter
  .route("/teacher")
  .get(isAuthenticated, isAuthorizedAdmin, getTeacher)
  .post(isAuthenticated, isAuthorizedAdmin, addTeacher);

adminRouter
  .route("/teacher/:teacherId")
  .get(isAuthenticated, isAuthorizedAdmin, getTeacherDetail)
  .put(isAuthenticated, isAuthorizedAdmin, updateTeacher)
  .delete(isAuthenticated, isAuthorizedAdmin, deleteTeacher);

adminRouter
  .route("/teacher/:teacherId/:batchId")
  .put(isAuthenticated, isAuthorizedAdmin, assignTeacher)
  .patch(isAuthenticated, isAuthorizedAdmin, unAssignTeacher);
adminRouter
  .route("/teacher/batch/:batchId")
  .get(isAuthenticated, isAuthorizedAdmin, getBatchTeacher);

//Student
adminRouter
  .route("/student")
  .get(isAuthenticated, isAuthorizedAdmin, getStudent)
  .post(isAuthenticated, isAuthorizedAdmin, addStudent);

adminRouter
  .route("/student/:studentId")
  .get(isAuthenticated, isAuthorizedAdmin, getStudentDetail)
  .put(isAuthenticated, isAuthorizedAdmin, updateStudent)
  .delete(isAuthenticated, isAuthorizedAdmin, deleteStudent);
adminRouter
  .route("/student/:studentId/:batchId")
  .put(isAuthenticated, isAuthorizedAdmin, insertStudent)
  .patch(isAuthenticated, isAuthorizedAdmin, unAssignStudent);

adminRouter
  .route("/student/batch/:batchId")
  .get(isAuthenticated, isAuthorizedAdmin, getBatchStudent);

adminRouter
  .route("/update-password")
  .post(isAuthenticated, isAuthorizedAdmin, updatePasswordAdmin);

  adminRouter
  .route("/info")
  .get(isAuthenticated, isAuthorizedAdmin, adminInfo);

export default adminRouter;
