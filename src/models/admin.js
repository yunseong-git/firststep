import mongoose from "mongoose";

//관리자 collection: 로그인 전용
const adminSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // 로그인 ID
  password: { type: String, required: true }, // 비밀번호
  mId: { type: String, required: true, unique: true }, // 군번
  position: { type: String, required: true }, // 직책
  rank: { type: String, required: true }, // 계급
  name: { type: String, required: true }, // 이름
  role: { type: String, required: true } // 권한
});

export const admin = mongoose.model("admin",adminSchema);