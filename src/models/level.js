import mongoose from 'mongoose';

//병사들의 현재수준 스키마(score에서 aggregation활용/최고점 기록))
const totalSchema = new mongoose.Schema({
    militaryId: { type: String, required: true, unique: true },
    pysical: { //체력
      score: { type: Number, default: 0 },
      validUntil: { type: Date } //유지기간(평가일로부터 6개월)
    },
    basic: { //병기본
      score: { type: Number, default: 0 },
      validUntil: { type: Date }
    },
    mission: { //주특기
      score: { type: Number, default: 0 },
      validUntil: { type: Date }
    },
    level: { //종합수준(체력+병기본+주특기의 평균값)
      score: { type: Number, default: 0 },
      validUntil: { type: Date } //세가지 수준의 유효기간 중 가장 짧은 것을 따름
    }
  });
  