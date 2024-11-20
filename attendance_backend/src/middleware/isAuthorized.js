import expressAsyncHandler from "express-async-handler";

export let isAuthorizedAdmin = expressAsyncHandler((req, res, next) => {
  let role = req.body.info.role;

  if (role === "admin") {
    next();
  } else {
    let error = new Error("Access Not granted");
    error.statusCode = 403;
    throw error;
  }
});
export let isAuthorizedTeacher = expressAsyncHandler((req, res, next) => {
  let role = req.body.info.role;

  if (role === "teacher") {
    next();
  } else {
    let error = new Error("Access Not granted");
    error.statusCode = 403;
    throw error;
  }
});
export let isAuthorizedStudent = expressAsyncHandler((req, res, next) => {
  let role = req.body.info.role;

  if (role === "student") {
    next();
  } else {
    let error = new Error("Access Not granted");
    error.statusCode = 403;
    throw error;
  }
});

export let isAuthorized = expressAsyncHandler((req, res, next) => {
  let role = req.body.info.role;

  if (role === "teacher" || role === "admin" || role === "student") {
    next();
  } else {
    let error = new Error("Access Not granted");
    error.statusCode = 403;
    throw error;
  }
});
