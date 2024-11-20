import { Schema } from "mongoose";

export let studentSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique:true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  batchId: {
    type: [Schema.Types.ObjectId],
    ref: "Batch",
  },
});
