import express, { json } from "express";
import { connectDb } from "./src/connectdb/connectdb.js";
import { studentRouter } from "./src/Routes/studentRouter.js";
import { teacherRouter } from "./src/Routes/teacherRouter.js";
import attendanceRouter from "./src/Routes/attendanceRouter.js";
import adminRouter from "./src/Routes/adminRouter.js";
import cors from "cors";
import { errorMiddleware } from "./src/helper/errorMiddleware.js";
import { PORT } from "./src/config/constant.js";
import { helperRouter } from "./src/Routes/helperRouter.js";
import { removeExpiredToken } from "./src/utils/token.js";
import { dateNow } from "./src/utils/Date.js";

let app = new express();
connectDb();
// removeExpiredToken()
const allowedOrigins = ["http://localhost:5173"];
const options = {
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(options));
app.use(json());
// app.use((req,res,next)=>{
//   console.log("Request Received:"+req.method+" "+req.url)
//   next()
// })
app.use("/", helperRouter);
app.use("/teacher", teacherRouter);
app.use("/student", studentRouter);
app.use("/attendance", attendanceRouter);
app.use("/admin", adminRouter);

app.use(express.static("./public"));
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`app is listening at port number ${PORT}`);
  console.log(`http://localhost:${PORT}/`);
});
