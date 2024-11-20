import expressAsyncHandler from "express-async-handler"
import { Admin, Student, Teacher, Token } from "../schema/model.js"
import { errorResponse } from "../helper/errorResponse.js"
import { comparePassword } from "../utils/Hashing.js"
import { generateToken, verifyToken } from "../utils/token.js"
import { successResponse } from "../helper/successResponse.js"
import { HttpStatus } from "../config/constant.js"

export let login=expressAsyncHandler(async (req,res,next) => {
    let email = req.body.email
    let password = req.body.password
    console.log("email is " + email + " password is "+ password)
    let resultAdmin = await Admin.findOne({ email })
    console.log("admin result " + resultAdmin)
    let resultTeacher = await Teacher.findOne({ email })
    let resultStudent = await Student.findOne({ email })
    if(resultAdmin===null && resultTeacher===null && resultStudent===null ) 
      errorResponse({res,message: "Credential didn't match",statusCode:401})
      let role;
      let result;
    if(resultAdmin)
    {  
        result=resultAdmin
        role="admin"
    }
    else if(resultTeacher)
    {
        result=resultTeacher
        role="teacher"
    }
    else{
        result=resultStudent
        role="student"
    }
    let jwt_token;
    if (await comparePassword(password, result.password)) {
      let infoObj = {
        id: result._id,
        role,
      };
      let expireInfo = {
        expiresIn: "365d",
      };
    jwt_token = await generateToken(infoObj, expireInfo);
      await Token.create({ token: jwt_token });
    } 
    else 
    errorResponse({res,message: "Credential didn't match",statusCode:401})
  
    let response = {
      res: res,
      message: "success",
      result: {
        token: jwt_token,
        role        
      },
      statusCode: HttpStatus.OK,
    };
  
    successResponse(response)
})

export let logout = expressAsyncHandler(async(req,res,next)=>{
  let id=req.body.token.tokenId
  await Token.findByIdAndDelete({_id:id})
  let response = {
    res: res,
    message: "Successfully logged out",
    statusCode: HttpStatus.OK,
  };

  successResponse(response);

})

export let TokenVerification=expressAsyncHandler(async (req,res,next)=>{
    let bearerTokenStr=req.headers.authorization
    let tokenArr=bearerTokenStr.split(" ")
      let token = tokenArr[1]
      
      let tokenAtDatabase = await Token.findOne({token})
      if (!tokenAtDatabase) {
        let error = new Error("Token is not valid")
        error.statusCode = 401;
        throw error;
      } 
      let info = await verifyToken(token)
     
      if(!info)
      {
        let error = new Error("Token is not valid");
        error.statusCode = 401;
        throw error;
      }
          
        let response={
          res,
          message:"Token is valid",
          result:{role:info.role},
          statusCode: HttpStatus.OK,
        }
        successResponse(response)
      }
  )