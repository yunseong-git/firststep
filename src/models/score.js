import mongoose from "mongoose";
//평가점수 스키마(M-주특기, B-병기본, P-체력)

const MscoreSchema = new mongoose.Schema({
  mId: { type: String, required: true, index: true }, // 🔥 `index: true` 추가
  title: { type: String, required: true }, // ex:)24/04 -> 24: 평가년도, 04: 4차평가(짝수는 정규평가,홀수는 열외자 및 재평가)
  date: { type: Date, required: true }, // 평가 날짜
  evaluator: { type: String, required: true }, // 평가관
  result: { type: String, required: true }, // 평가 결과 (종목별 점수)
});

const BscoreSchema = new mongoose.Schema({
  mId: { type: String, required: true, index: true }, // 🔥 `index: true` 추가
  title: { type: String, required: true }, // ex:)24/04 -> 24: 평가년도, 04: 4차평가(짝수는 정규평가,홀수는 열외자 및 재평가)
  date: { type: Date, required: true }, // 평가 날짜
  evaluator: { type: String, required: true }, // 평가관
  pushUp: { type: String, required: true }, // 평가 결과 (종목별 점수)
  sitUp: { type: String, required: true }, // 평가 결과 (종목별 점수)
  running: { type: String, required: true }, // 평가 결과 (종목별 점수)
});

const PscoreSchema = new mongoose.Schema({
  mId: { type: String, required: true, index: true }, // 🔥 `index: true` 추가
  title: { type: String, required: true }, // ex:)24/04 -> 24: 평가년도, 04: 4차평가(짝수는 정규평가,홀수는 열외자 및 재평가)
  date: { type: Date, required: true }, // 평가 날짜
  evaluator: { type: String, required: true }, // 평가관
  pushUp: { type: Number, required: true }, // 팔굽혀펴기(개수)
  sitUp: { type: Number, required: true }, // 윗몸일으키기(개수)
  running: { type: String, required: true }, // 뜀걸음(시간)
  total: { type: String, required: true }, // 평가 결과 (종목별 점수 평균)
});

//주특기
export const Mscore = mongoose.model("Mscore", MscoreSchema);

//병기본
export const Bscore = mongoose.model("Bscore", BscoreSchema);

//체력
export const Pscore = mongoose.model("Pscore", PscoreSchema);
