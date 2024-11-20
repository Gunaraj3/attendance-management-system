import { Schema } from "mongoose";

export let batchSchema = Schema({
  name: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
});
