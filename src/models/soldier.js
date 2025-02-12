import mongoose from "mongoose";

export { unit, soldier };

/**병사 개인정보 스키마*/
const soldierSchema = new mongoose.Schema({
  mId: { type: String, required: true, unique: true }, // 군번
  unit: { type: String, required: true }, // 소속 ex)unit1
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
const soldier = mongoose.model("soldier", soldierSchema);

/**부대 분류 스키마*/
const unitSchema = new mongoose.Schema({
  unitId: { type: String, required: true, index: true }, //unit number ex)unit1
  unitName: { type: String, required: true }, //ex)1소대, 중대본부
})
const unit = mongoose.model("unit", unitSchema);