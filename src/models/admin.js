import mongoose from "mongoose";

/**관리자(간부) 정보*/
const adminSchema = new mongoose.Schema({
    mId: { type: String, required: true, unique: true }, // 군번
    password: { type: String, required: true, select: false }, // 비밀번호(기본조회시 제외)
    position: { type: String, required: true }, // 직책
    rank: { type: String, required: true }, // 계급
    name: { type: String, required: true }, // 이름
    unit: { type: String, required: true }, // 소속(권한에 사용)
}, { timestamps: true }); // 생성 및 업데이트 시간 자동 관리

// 비밀번호 필드 제외 후, JSON 변환, 추후 _id필드도 고민필요
adminSchema.set("toJSON", { transform: (doc, ret) => { delete ret.password; } });
adminSchema.set("toObject", { transform: (doc, ret) => { delete ret.password; } });

const admin = mongoose.model("admin", adminSchema);

export { admin };