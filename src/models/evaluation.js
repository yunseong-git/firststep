import mongoose from "mongoose"

export { score, evaluation };

/**평가 세부정보 및 부대 점수*/
const evaluationSchema = new mongoose.Schema({
  tId: { type: String, required: true, unique: true }, //평가id
  title: { type: String, required: true }, //평가제목
  type: {
    type: String,
    enum: ["physical", "basic", "mission"], //체력, 병기본, 주특기
    required: true
  },
  date: { type: String, required: true }, //평가일
  evaluator: { type: String, required: true }, //평가관
  headCount: {
    unit1: { type: String, required: true }, //1소대
    unit2: { type: String, required: true }, //2소대
    unit3: { type: String, required: true }, //3소대
    unit4: { type: String, required: false }, //예비소대
    total: { type: String, required: true },
  },
  average: {
    unit1: { type: String, required: true }, //1소대
    unit2: { type: String, required: true }, //2소대
    unit3: { type: String, required: true }, //3소대
    unit4: { type: String, required: false }, //4소대
    total: { type: String, required: true }, //중대 총합
  },
  validUntil: { type: Date, required: true } // 평가일 기준 6개월 후 자동 설정
})
const evaluation = mongoose.model("evaluation", evaluationSchema);

/**개인 점수*/
const scoreSchema = new mongoose.Schema({
  mId: { type: String, required: true, index: true },
  results: {
    tId: { type: String, required: true, unique: true }, //평가id
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["physical", "basic", "mission"], //체력, 병기본, 주특기
      required: true
    },
    score1: { type: String, required: true }, //각 평가에 따라 다름(체력평가-score1:뜀걸음 등등)
    score2: { type: String, required: true }, //주특기의 경우에는 평가가 2개만 존재
    score3: { type: String, required: false },
    total: { type: Number, required: true }, //각 로직에 따라 처리후 저장
  }
})
const score = mongoose.model("score", scoreSchema);

/*점수 계산 로직 : 5단계로 구분, 각단계별로 60/70/80/90/100점

<체력평가> 
팔굽혀펴기: ~47/48~55/56~63/64~71/72~
윗몸일으키기: ~61/62~69/70~77/78~85/86~
뜀걸음: ~15:37/15:36~14:35/14:34~13:33/13:32~12:31/12:32~

종합: (뜀걸음*2 + 윗몸*1 + 팔굽*1) / 3 

<병기본평가>
핵 및 화생방, 전투부상자 처치, 정신전력 각각 점수 그대로 반영
종합: 3개 항목 평균

<주특기평가>
이론, 실습 각각 점수 그대로 반영
종합: 이론20%+실습80%
*/
