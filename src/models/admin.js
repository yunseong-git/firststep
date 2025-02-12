import mongoose from "mongoose";

export { admin };

/**관리자(간부) 정보*/
const adminSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // 로그인 ID
    password: { type: String, required: true }, // 비밀번호
    mId: { type: String, required: true, unique: true }, // 군번
    position: { type: String, required: true }, // 직책
    rank: { type: String, required: true }, // 계급
    name: { type: String, required: true }, // 이름
    unitId: { type: String, required: true } // 소속
});

const admin = mongoose.model("admin", adminSchema);