import expressAsyncHandler from "express-async-handler";
import { Attendance, Student } from "../schema/model.js";
import { successResponse } from "../helper/successResponse.js";
import { HttpStatus } from "../config/constant.js";
import { comparePassword, hashPassword } from "../utils/Hashing.js";

// export let loginStudent=expressAsyncHandler(async(req,res,next)=>{
//   let email=req.body.email
//   let password=req.body.password
//   let result = await Student.findOne({email});
//   let jwt_token;
//   if (await comparePassword(password,result.password)){
//     let infoObj={
//       id:result._id,
//       role:"student"
//     }
//     let expireInfo={
//       expiresIn:"365d"
//     }
//     jwt_token = await generateToken(infoObj, expireInfo);
//     await Token.create({token:jwt_token})
//   }
//     else{
//     let error= new Error("Credential didn't match")
//     error.statusCode=401
//     throw error
//     }

//   let response = {
//     res,
//     message: "student login successful",
//     result:
//       {
//         token:jwt_token,
//       },
//     statusCode: HttpStatus.OK,
//   };

//   successResponse(response);
// })

// export let logoutStudent = expressAsyncHandler(async(req,res,next)=>{
//   let id=req.body.token.tokenId
//   await Token.findByIdAndDelete({_id:id})
//   let response = {
//     res: res,
//     message: "successfully logged out",
//     statusCode: HttpStatus.OK,
//   };

//   successResponse(response);

// })

export let showEnrolledClasses = expressAsyncHandler(async (req, res, next) => {
  let _studentId = req.body.info.id;
  let theStudent = await Student.find({ _id: _studentId }).populate({
    path: "batchId",
  });
  let response = {
    res,
    message: "Student's Enrolled class details",
    result: theStudent[0].batchId,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});

export let studentDetail = expressAsyncHandler(async (req, res, next) => {
  let _studentId = req.body.info.id;
  let result = await Student.find({ _id: _studentId });

  let response = {
    res,
    message: "Student Detail",
    result,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});

export let attendanceDetail = expressAsyncHandler(async (req, res, next) => {
  let _studentId = req.body.info.id;
  let _batchId = req.params.batchId;
  let result = await Attendance.find({
    batchId: _batchId,
    studentId: _studentId,
  })
    .populate({
      path: "studentId",
    })
    .populate({
      path: "batchId",
    });
  let response = {
    res,
    message: "Attendance of a student of a particular batch",
    result,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});

export let updatePasswordStudent = expressAsyncHandler(
  async (req, res, next) => {
    let studentId = req.body.info.id;
    let theStudent = await Student.findOne({ _id: studentId });
    let currentPassword = req.body.currentPassword;
    if (!(await comparePassword(currentPassword, theStudent.password))) {
      let error = new Error("Password didn't match");
      error.statusCode = 401;
      throw error;
    }
    let _hashPassword = await hashPassword(req.body.newPassword);
    let result = await Student.findByIdAndUpdate(
      { _id: studentId },
      { password: _hashPassword }
    );

    let response = {
      res,
      result: { id: studentId },
      message: "Password Changed Successfully",
      statusCode: HttpStatus.OK,
    };

    successResponse(response);
  }
);

export let studentInfo = expressAsyncHandler(async (req, res, next) => {
  let teacherId = req.body.info.id;
  let theTeacher = await Student.findOne({ _id: teacherId }).select(
    "-password -__v"
  );
  let currentPassword = req.body.currentPassword;
  if (!theTeacher) {
    let error = new Error("no student");
    error.statusCode = 401;
    throw error;
  }

  let response = {
    res,
    result: theTeacher,
    message: "student info",
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});
