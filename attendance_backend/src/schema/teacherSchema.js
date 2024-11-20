import { Schema, Types } from "mongoose";

export let teacherSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true
  },
  batchId: {
    type: [Types.ObjectId],
    ref: "Batch"
  }
});
