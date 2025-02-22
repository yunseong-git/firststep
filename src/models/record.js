import mongoose from "mongoose";

export { record };

/**면담기록 collection*/
const recordSchema = new mongoose.Schema({ //병사당 한개의 document를 가짐
    mId: { type: String, required: true },
    records: [{ //기록은 배열로 관리
        date: { type: Date, required: true },
        interviewer: { type: String, required: true },
        type: {  //면담 종류
            type: String,
            enum: ["regular", "frequent", "special"], //정기, 수시, 특별 면담
            required: true
        },
        priority: { type: Number, required: true }, //중요도
        content: { type: String, required: true } //내용
    }],
});

const record = mongoose.model("record", recordSchema);