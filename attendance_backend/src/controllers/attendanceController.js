import expressAsyncHandler from "express-async-handler";
import { Attendance, Student } from "../schema/model.js";
import { successResponse } from "../helper/successResponse.js";
import { HttpStatus } from "../config/constant.js";
import { Parser } from "json2csv";
import { dateNow } from "../utils/Date.js";

export let studentList = expressAsyncHandler(async (req, res, next) => {
  let _batchId = req.params.batchId;
  let studentList = await Student.find({ batchId: _batchId });
  let response = {
    res,
    result: studentList,
    message: "All students of this Batch",
    statusCode: HttpStatus.OK,
  };
  successResponse(response);
});

export let submitAttendance = expressAsyncHandler(async (req, res, next) => {
  let _batchId = req.params.batchId;
  let _data = req.body.data;
  let _date = new Date(dateNow());

  let check = await Attendance.find({
    batchId: _batchId,
    date: _date.toISOString(),
  });

  if (check[0] !== undefined) {
    let error = new Error("Attendance for today is already submitted");
    error.statusCode = 409;
    throw error;
  }
  _data.year = new Date().getYear() + 1900;
  _data.month = new Date().getMonth() + 1;
  for (let i = 0; i < _data.length; i++) {
    // let status = _data[i].status === "P" ? 0 : _data[i].status === "A" ? 1 : 2;
    await Attendance.create({
      status:_data[i].status,
      studentId: _data[i].studentId,
      batchId: _batchId,
      year: _data.year,
      month: _data.month,
    });
  }
  let response = {
    res,
    message: "Attendance Successfully submitted",
    statusCode: HttpStatus.OK,
  };
  successResponse(response);
});

export let getAttendanceByDate = expressAsyncHandler(async (req, res, next) => {
  let _batchId = req.params.batchId;
  let desiredYear = req.params.year;
  let desiredMonth = req.params.month;
  // console.log(_batchId, desiredYear, desiredMonth, ".....");
  let result = await Attendance.find({
    batchId: _batchId,
    year: desiredYear,
    month: desiredMonth,
  }).populate({
    path: "studentId",
  });
  // .populate({
  //   path: "batchId",
  // });

  // console.log("result........", result);

  let response = {
    res,
    message: "Attendance Report",
    result,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});

export let getAllAttendance = expressAsyncHandler(async (req, res, next) => {
  let _batchId = req.params.batchId;
  let result = await Attendance.find({ batchId: _batchId });
  // let result = await Attendance.find({ batchId: _batchId })
  //   .populate({
  //     path: "studentId",
  //   })
  //   .populate({
  //     path: "batchId",
  //   });
  // console.log(result);
  // let response = {
  //   res,
  //   message: "Attendance Report",
  //   result,
  //   statusCode: HttpStatus.OK,
  // };

  // successResponse(response);
});

export let exportAllAttendance = expressAsyncHandler(async (req, res, next) => {
  const parser = new Parser();
  let myData = await Attendance.find({ batchId: req.params.batchId }).populate({
    path: "studentId",
  });
  let _myData = myData.map((curr) => {
    return {
      Date: curr.date,
      name: curr.studentId.name,
      status:
        curr.status === 0 ? "present" : curr.status === 1 ? "absent" : "leave",
    };
  });
  let _myDataSorted = _myData.sort(
    (a, b) => new Date(a.Date) - new Date(b.Date)
  );
  let csv = parser.parse(_myDataSorted);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment:filename=userData.csv");
  res.status(200).end(csv);
});

export let exportStudentAttendance = async (req, res, next) => {
  const parser = new Parser();
  let myData = await Attendance.find({
    batchId: req.params.batchId,
  }).populate({
    path: "studentId",
    match: {
      email: req.params.email,
    },
  });
  console.log("my data .........", myData, "....................my data");

  let result = myData.filter((attendance) => attendance.studentId !== null);
  let _myData = result.map((curr) => {
    return {
      Date: curr.date,
      name: curr.studentId.name,
      status:
        curr.status === 0 ? "present" : curr.status === 1 ? "absent" : "leave",
    };
  });
  let _myDataSorted = _myData.sort(
    (a, b) => new Date(a.Date) - new Date(b.Date)
  );
  let csv = parser.parse(_myDataSorted);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment:filename=userData.csv");
  res.status(200).end(csv);
};

export let exportAttendanceByDate = expressAsyncHandler(
  async (req, res, next) => {
    const parser = new Parser();
    let desiredYear = req.params.year;
    let desiredMonth = req.params.month;
    let myData = await Attendance.find({
      batchId: req.params.batchId,
      year: desiredYear,
      month: desiredMonth,
    }).populate({ path: "studentId" });
    let _myData = myData.map((curr) => {
      return {
        Date: curr.date.toISOString().split("T")[0],
        name: curr.studentId?.name || "no name",
        status:
          curr.status === 0
            ? "present"
            : curr.status === 1
            ? "absent"
            : "leave",
      };
    });
    let _myDataSorted = _myData.sort(
      (a, b) => new Date(a.Date) - new Date(b.Date)
    );
    let csv = parser.parse(_myDataSorted);
    // console.log(csv, "csv.......");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment:filename=userData.csv");
    res.status(200).end(csv);
  }
);

export let getAttendance = expressAsyncHandler(async (req, res, next) => {
  // console.log(req.body, "alfjla,,,,,,,,,,,,,,,,,,,,,,,,,");
  let _batchId = req.params.batchId;
  // let desiredYear = req.params.year;
  // let desiredMonth = req.params.month;
  let email = req.params.email;
  // console.log(_batchId, desiredYear, desiredMonth, ".....");
  let result = await Attendance.find({
    batchId: _batchId,

    // year: desiredYear,
    // month: desiredMonth,+
  }).populate({
    path: "studentId",
    match: {
      email: email,
    },
  });
  // .populate({
  //   path: "batchId",
  // });

  console.log("result........", result);
  result = result.filter((attendance) => attendance.studentId !== null);

  let response = {
    res,
    message: "Attendance Report",
    result,
    statusCode: HttpStatus.OK,
  };

  successResponse(response);
});
