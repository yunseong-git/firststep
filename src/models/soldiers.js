import mongoose from "mongoose";
//병사 기본정보 스키마
const soldierSchema = new mongoose.Schema({
  mId: { type: String, required: true, unique: true }, // 군번
  unit: { type: String, required: true }, // 소속 (예: "1소대")
  rank: { type: String, required: true }, //계급
  name: { type: String, required: true }, //이름
  startDate: { type: Date, required: true }, // 입대일
  endDate: { type: Date, required: true }, // 전역일(입대일로부터 180일 후)
  specialty: { type: String, required: true }, //주특기(정보통신)
  specialtyCode: { type: Number, required: true }, //주특기세부번호(171101)
  position: { type: String, required: true }, //직책(ex: "통신 운용/정비병")
  phoneNumber: { type: String, required: true }, //전화번호
  height: { type: Number, required: true }, //키
  hobby: { type: String }, //취미
});

export const soldier = mongoose.model("soldier", soldierSchema);