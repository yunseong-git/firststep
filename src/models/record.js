import mongoose from "mongoose";

//면담기록 collection
const recordSchema = new mongoose.Schema({
    mId: { type: String, required: true },
    date: { type: Date, required: true },
    interviewer: { type: String, required: true },
    type: {  //면담 종류
      type: String, 
      enum: ["regular", "frequent", "special"], //정기, 수시, 특별 면담
      required: true 
    },
    priority: { type: Number, required: true }, //중요도
    content: { type: String, required: true }
  });

export const record = mongoose.model("record", recordSchema);