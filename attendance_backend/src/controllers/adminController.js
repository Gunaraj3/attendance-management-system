import { HttpStatus } from "../config/constant.js";
import { successResponse } from "../helper/successResponse.js";
import expressAsyncHandler from "express-async-handler";
import { Admin, Batch, Student, Teacher } from "../schema/model.js";
import { comparePassword, hashPassword } from "../utils/Hashing.js";
import { Types } from "mongoose";
import { deleteElementByIndex, findIndex } from "../utils/arrayMethods.js";

// export let loginAdmin =expressAsyncHandler(async (req, res, next) => {
//   let email = req.body.email
//   let password = req.body.password
//   let result = await Admin.findOne({ email })
//   if(result===null)
//     errorResponse({res,message: "Credential didn't match",statusCode:401})
//   let jwt_token;
//   if (await comparePassword(password, result.password)) {
//     let infoObj = {
//       id: result._id,
//       role: "admin",
//     };
//     let expireInfo = {
//       expiresIn: "365d",
//     };
//   jwt_token = await generateToken(infoObj, expireInfo);
//     await Token.create({ token: jwt_token });
//   }
//   else
//   errorResponse({res,message: "Credential didn't match",statusCode:401})

//   let response = {
//     res: res,
//     message: "success",
//     result: {
//       token: jwt_token,
//     },
//     statusCode: HttpStatus.OK,
//   };

//   successResponse(response);
// })
// export let logout = expressAsyncHandler(async (req, res, next) => {
//   let id = req.body.token.tokenId;
//   await Token.findByIdAndDelete({ _id: id });
//   let response = {
//     res: res,
//     message: "successfully logged out",
//     statusCode: HttpStatus.OK,
//   };

//   successResponse(response);
// });

export let addAdmin = expressAsyncHandler(async (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
    let error = new Error("Password Too Weak");
    error.statusCode = 401;
    throw error;
  }
  let adminData = await Admin.findOne({ email });

  if (adminData) {
    let error = new Error("User already exists");
    error.statusCode = 409;
    throw error;
  } else {
    let _hashPassword = await hashPassword(password);
    let result = await Admin.create({ email, password: _hashPassword });
    delete result._doc.password;
    // let infoObj = {
    //   id: result._id,
    //   role: "admin",
    // }
    // let expireInfo = {
    //   expiresIn: "1d",
    // }
    // let token = await generateToken(infoObj, expireInfo);
    // await Token.create({ token });

    let response = {
      res,
      message: "Success",
      result,
      statusCode: HttpStatus.CREATED,
    };
    successResponse(response);
  }
});

export let addBatch = expressAsyncHandler(async (req, res, next) => {
  let name = req.body.name;
  let course = req.body.course;
  let result = await Batch.create({ name, course });

  let response = {
    res,
    message: "Batch Created",
    result,
    statusCode: HttpStatus.CREATED,
  };

  successResponse(response);
});
export let updateBatch = expressAsyncHandler(async (req, res, next) => {
  let batchId = req.params.batchId;
  let _data = req.body.data;
  delete _data.password;
  let result = await Batch.findByIdAndUpdate(batchId, _data, {
    new: true,
  });
  let response = {
    res,
    message: "Batch Updated successfully",
    result,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});

// export let updateUser = expressAsyncHandler(async (req, res, next) => {

//   let result = await User.findByIdAndUpdate(req.params.id, req.body);

//   let response = {
//     res: res,
//     message: "updated",
//     result: "updated",
//     statusCode: HttpStatus.CREATED,
//   };

//   successResponse(response);

// });

// export let deleteUser = expressAsyncHandler(async(req,res,next)=>{

//   // try{

//      let result = await User.findByIdAndDelete(req.params.id)

// let response = {"res":res,"message":"deleted","result":"deleted","statusCode":HttpStatus.CREATED}

//   successResponse(response)

// // }catch(error){

//   //   let response = {
//   //    "res":res,
//   //    "message":error.message,
//   //    "statusCode":HttpStatus.BAD_REQUEST
//   //   }

//   //  errorResponse(response)

// //   error.statusCode = HttpStatus.BAD_REQUEST
// //   next(error)

// // }

// })

// export let getTeacher = expressAsyncHandler(async (req, res, next) => {
//   // try{

//   //  let result = await User.find({name:"nitan"}) // this is exact searching
//   //  let result = await User.find({name:"nitan",age:29}) /// this is exact searching
//   //  let result = await User.find({age:{$gt:33}}) /// this is exact searching
//   //  let result = await User.find({age:{$gte:33}}) /// this is exact searching
//   //  let result = await User.find({age:{$lt:33}}) /// this is exact searching
//   //  let result = await User.find({age:{$lte:33}}) /// this is exact searching
//   //  let result = await User.find({age:{$ne:33}}) /// this is exact searching
//   //  let result = await User.find({name:{$in:["nitan"]}}) /// this is exact searching

//   //  let result = await User.find({$or:[{name:"a"},{name:"nitan"}]}) /// this is exact searching
//   //  let result = await User.find({$and:[{age:33},{name:"nitan"}]}) /// this is exact searching
//   // let result = await Teacher.find().populate({
//   // path: "batchId",
//   // match: {
//   //   course: "dot net",
//   // },
//   // }); /// this is exact searching

//   // let result = await Teacher.find({_id: 'a'}).populate({
//   //   path:"batchId",
//   //   match:{
//   //     _id:req.params
//   //   },
//   //   populate:{
//   //     path:"studentId",
//   //     match

//   //   }
//   // })

//   let result = await Teacher.find({
//     _id: "64818d8b43933fbec54ae4b0",
//   });

//   let response = {
//     res: res,
//     message: "hello",
//     result: result,
//     statusCode: HttpStatus.CREATED,
//   };

//   successResponse(response);

//   // }catch(error){

//   //   let response = {
//   //    "res":res,
//   //    "message":error.message,
//   //    "statusCode":HttpStatus.BAD_REQUEST
//   //   }

//   //  errorResponse(response)
//   //   error.statusCode = HttpStatus.BAD_REQUEST
//   //   next(error)

//   // }
// });
export let getBatch = expressAsyncHandler(async (req, res, next) => {
  let result = await Batch.find({});

  let response = {
    res: res,
    message: "All Batch detail",
    result: result,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});

export let getBatchDetails = expressAsyncHandler(async (req, res, next) => {
  let id = req.params.batchId;
  try {
    var result = await Batch.findOne({ _id: id });
  } catch (error) {
    error.statusCode = 404;
    error.message = "Invalid BatchId";
    throw error;
  }

  let response = {
    res,
    message: "Batch Detail",
    result,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});
export let getTeacher = expressAsyncHandler(async (req, res, next) => {
  let result = await Teacher.find({});
  result = result.map((element) => {
    delete element._doc.password;
    return element;
  });
  let response = {
    res: res,
    message: "All Teachers detail",
    result: result,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});

export let getAdmin = expressAsyncHandler(async (req, res, next) => {
  let result = await Admin.find({});
  // console.log(result)
  result = result.map((element) => {
    delete element._doc.password;
    return element;
  });
  let response = {
    res: res,
    message: "All Admin detail",
    result: result,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});

export let addTeacher = expressAsyncHandler(async (req, res, next) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
    let error = new Error("Password Too Weak");
    error.statusCode = 401;
    throw error;
  }
  let hashed_password = await hashPassword(password);
  var result = await Teacher.create({ name, email, password: hashed_password });

  delete result._doc.password;
  let response = {
    res: res,
    message: "Teacher Added",
    result,
    statusCode: HttpStatus.CREATED,
  };

  successResponse(response);
});

export let getBatchTeacher = expressAsyncHandler(async (req, res, next) => {
  let _batchId = req.params.batchId;

  let query = {
    batchId: { $in: [new Types.ObjectId(_batchId)] },
  };

  let result = await Teacher.find(query);

  let response = {
    res,
    message: "successfully assigned",
    result,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});
export let getBatchStudent = expressAsyncHandler(async (req, res, next) => {
  let _batchId = req.params.batchId;

  let query = {
    batchId: { $in: [new Types.ObjectId(_batchId)] },
  };

  let result = await Student.find(query);

  let response = {
    res,
    message: "successfully assigned",
    result,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});
// export let assignBatchToTeacher =expressAsyncHandler(async(req,res,next)=>{
//   let
// })
export let getStudent = expressAsyncHandler(async (req, res, next) => {
  let result = await Student.find({});
  result = result.map((element, index) => {
    delete element._doc.password;
    return element;
  });
  let response = {
    res,
    message: "All students detail",
    result,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});

export let addStudent = expressAsyncHandler(async (req, res, next) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
    let error = new Error("Password Too Weak");
    error.statusCode = 401;
    throw error;
  }
  password = await hashPassword(password);
  let result = await Student.create({ name, email, password });
  delete result._doc.password;
  let response = {
    res,
    message: "Student added",
    result,
    statusCode: HttpStatus.CREATED,
  };

  successResponse(response);
});

export let getStudentDetail = expressAsyncHandler(async (req, res, next) => {
  let id = req.params.studentId;
  try {
    var result = await Student.findOne({ _id: id });
  } catch (error) {
    error.statusCode = 404;
    error.message = "Invalid StudentId";
    throw error;
  }
  let response = {
    res: res,
    message: "success",
    result: result,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});

export let getTeacherDetail = expressAsyncHandler(async (req, res, next) => {
  let id = req.params.teacherId;
  try {
    var result = await Teacher.findOne({ _id: id });
  } catch (error) {
    error.statusCode = 404;
    error.message = "Invalid TeacherId";
    throw error;
  }
  let response = {
    res,
    message: "success",
    result,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});

export let insertStudent = expressAsyncHandler(async (req, res, next) => {
  let _batchId = req.params.batchId;
  let studentId = req.params.studentId;
  try {
    var theStudent = await Student.findById(studentId);
  } catch (error) {
    error.statusCode = 404;
    error.message = "Invalid studentId";
    throw error;
  }
  try {
    var checkIfBatchExists = await Batch.findOne({ _id: _batchId });
  } catch (error) {
    error.statusCode = 404;
    error.message = "Invalid BatchId";
    throw error;
  }
  if (checkIfBatchExists === null) {
    let error = new Error("No such batch exists");
    error.statusCode = 404;
    throw error;
  }
  theStudent.batchId.push(_batchId);
  let result = await Student.findByIdAndUpdate(studentId, theStudent, {
    new: true,
  });
  let response = {
    res,
    message: "Student enrolled in class successfully",
    result,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});

export let updateStudent = expressAsyncHandler(async (req, res, next) => {
  let studentId = req.params.studentId;
  let _data = req.body.data;
  delete _data.password;
  try {
    var result = await Student.findByIdAndUpdate(studentId, _data, {
      new: true,
    });
  } catch (error) {
    error.statusCode = 404;
    error.message = "Invalid studentId";
    throw error;
  }
  let response = {
    res,
    message: "Student Updated successfully",
    result,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});
export let updateTeacher = expressAsyncHandler(async (req, res, next) => {
  let teacherId = req.params.teacherId;
  let _data = req.body.data;
  delete _data.password;
  let result;
  try {
    result = await Teacher.findByIdAndUpdate(teacherId, _data, {
      new: true,
    });
  } catch (error) {
    error.statusCode = 404;
    error.message = "Invalid teacherId";
    throw error;
  }
  let response = {
    res,
    message: "Teacher Updated successfully",
    result,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});

export let deleteTeacher = expressAsyncHandler(async (req, res, next) => {
  let teacherId = req.params.teacherId;
  try {
    var result = await Teacher.findByIdAndDelete(teacherId, { new: true });
  } catch (error) {
    error.message = "Invalid teacherId";
    error.statusCode = 404;
    throw error;
  }
  if (result === null) {
    let error = new Error("No such teacher exists");
    error.statusCode = 404;
    throw error;
  }
  let response = {
    res,
    message: "Teacher Account Deleted successfully",
    result,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});

export let deleteStudent = expressAsyncHandler(async (req, res, next) => {
  let studentId = req.params.studentId;
  try {
    var result = await Student.findByIdAndDelete(studentId);
  } catch (error) {
    error.message = "Invalid studentId";
    error.statusCode = 404;
    throw error;
  }
  if (result === null) {
    let error = new Error("No such student exists");
    error.statusCode = 404;
    throw error;
  }
  let response = {
    res,
    message: "Student Account Deleted successfully",
    result,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});

export let unAssignTeacher = expressAsyncHandler(async (req, res, next) => {
  let _batchId = req.params.batchId;
  let _teacherId = req.params.teacherId;
  try {
    var theTeacher = await Teacher.findById(_teacherId);
  } catch (error) {
    error.statusCode = 404;
    error.message = "Invalid teacherId";
    throw error;
  }
  let indexToDelete = findIndex(_batchId, theTeacher.batchId);
  deleteElementByIndex(theTeacher.batchId, indexToDelete);

  let result = await Teacher.findByIdAndUpdate(_teacherId, theTeacher, {
    new: true,
  });
  let response = {
    res,
    message: "Teacher Unassigned",
    result,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});
export let unAssignStudent = expressAsyncHandler(async (req, res, next) => {
  let _batchId = req.params.batchId;
  let _studentId = req.params.studentId;
  try {
    var theStudent = await Student.findById(_studentId);
  } catch (error) {
    error.statusCode = 404;
    error.message = "Invalid studentId";
    throw error;
  }
  let indexToDelete = findIndex(_batchId, theStudent.batchId);
  deleteElementByIndex(theStudent.batchId, indexToDelete);

  let result = await Student.findByIdAndUpdate(_studentId, theStudent, {
    new: true,
  });
  let response = {
    res,
    message: "Student Unassigned",
    result,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});

export let assignTeacher = expressAsyncHandler(async (req, res, next) => {
  let _batchId = req.params.batchId;
  let teacherId = req.params.teacherId;
  try {
    var theTeacher = await Teacher.findById(teacherId);
  } catch (error) {
    error.statusCode = 404;
    error.message = "Invalid TeacherId";
    throw error;
  }
  try {
    var checkIfBatchExists = await Batch.findOne({ _id: _batchId });
  } catch (error) {
    error.statusCode = 404;
    error.message = "Invalid BatchId";
    throw error;
  }
  if (checkIfBatchExists === null) {
    let error = new Error("No such batch exists");
    error.statusCode = 404;
    throw error;
  }
  theTeacher.batchId.push(_batchId);
  let result = await Teacher.findByIdAndUpdate(teacherId, theTeacher, {
    new: true,
  });
  let response = {
    res,
    message: "Teacher Assigned",
    result,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});

export let updateCourse = expressAsyncHandler(async (req, res, next) => {
  let name = req.body.name;
  let course = req.body.course;
  let _batchId = req.params.batchId;
  try {
    var result = await Batch.findByIdAndUpdate(
      _batchId,
      { name, course },
      { new: true }
    );
  } catch (error) {
    error.statusCode = 404;
    error.message = "Invalid BatchId";
    throw error;
  }

  let response = {
    res,
    message: "Batch detail updated",
    result,
    statusCode: HttpStatus.OK,
  };
  successResponse(response);
});

export let updatePasswordAdmin = expressAsyncHandler(async (req, res, next) => {
  let teacherId = req.body.info.id;
  let theTeacher = await Admin.findOne({ _id: teacherId });
  let currentPassword = req.body.currentPassword;
  if (!(await comparePassword(currentPassword, theTeacher.password))) {
    let error = new Error("Password didn't match");
    error.statusCode = 401;
    throw error;
  }
  let _hashPassword = await hashPassword(req.body.newPassword);
  let result = await Admin.findByIdAndUpdate(
    { _id: teacherId },
    { password: _hashPassword }
  );

  let response = {
    res,
    result: { id: teacherId },
    message: "Password Changed Successfully",
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});

export let adminInfo = expressAsyncHandler(async (req, res, next) => {
  let teacherId = req.body.info.id;
  let theTeacher = await Admin.findOne({ _id: teacherId }).select(
    "-password -__v"
  );
  let currentPassword = req.body.currentPassword;
  if (!theTeacher) {
    let error = new Error("no admin");
    error.statusCode = 401;
    throw error;
  }

  let response = {
    res,
    result: theTeacher,
    message: "admin info",
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});

export let deleteAdmin = expressAsyncHandler(async (req, res, next) => {
  let adminId = req.params.adminId;
  try {
    var result = await Admin.findByIdAndDelete(adminId, { new: true });
  } catch (error) {
    error.message = "Invalid adminId";
    error.statusCode = 404;
    throw error;
  }
  if (result === null) {
    let error = new Error("No such Admin exists");
    error.statusCode = 404;
    throw error;
  }
  let response = {
    res,
    message: "Admin Account Deleted successfully",
    result,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});

export let updateAdmin = expressAsyncHandler(async (req, res, next) => {
  let adminId = req.params.adminId; 
  let _data = req.body.data;
  delete _data.password;
  try {
    var result = await Admin.findByIdAndUpdate(adminId, _data, {
      new: true
    });
  } catch (error) {
    // console.log("error")
    error.statusCode = 404;
    error.message = "Invalid adminId";
    throw error;
  }
  let response = {
    res,
    message: "Admin Updated successfully",
    result,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});
