import mongoose from "mongoose";
import { soldier } from "../models/soldier";
import { Bscore, Pscore, Mscore } from "../models/evaluation"

export const soldierController = {
    saveSoldier,
    getSoldier,
    getAllSoldiers,
    updateSoldier,
    deleteSoldier,
};

/**병사 개인정보 저장 */
async function saveSoldier(req, res, next) {
    try {
        const newSoldier = new soldier({
            mId: req.body.mId,
            unit: req.body.unit,
            rank: req.body.rank,
            name: req.body.name,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            specialty: req.body.specialty,
            specialtyCode: req.body.specialtyCode,
            position: req.body.position,
            phoneNumber: req.body.phoneNumber,
            height: req.body.height,
            hobby: req.body.hobby
        })

        await newSoldier.save();

        console.log("병사 등록 완료:", newSoldier);
        res.status(201).json(newSoldier);
    } catch (err) {
        res.status(400).json({ message: err.message });
        next(err);
    }
}

/**병사 개인정보 조회 */
async function getSoldier(req, res, next) {
    try {
        const { mId } = req.params;
        const soldierData = await soldier.findOne({ mId })

        if (!soldierData) {
            return res.status(404).json({ message: "해당 군번의 병사가 존재하지 않습니다." });
        }

        //병사 상세 조회
        if (req.user.role !== "all" && soldierData.unit !== req.user.role) {
            return res.status(403).json({ message: "접근 권한이 없습니다." });
        }

        console.log("병사 조회 성공:", soldierData);
        res.status(200).json(soldierData);

    } catch (err) {
        console.error("병사 조회 중 오류 발생:", err);
        res.status(500).json({ message: "서버 오류 발생" });
        next(err);
    }
}

async function getSoldierScores(req, res, next) {
    try {
        const { mId } = req.params;
        const soldierScoreM = await Mscore.findOne({ mId })
        const soldierScoreB = await Bscore.findOne({ mId })
        const soldierScoreP = await Pscore.findOne({ mId })
        if (!soldierScoreM && !soldierScoreB && !soldierScoreP) {
            return res.status(404).json({ message: "해당 군번의 점수가 존재하지 않습니다." });
        }

        //병사 상세 조회
        if (req.user.role !== "all" && soldierData.unit !== req.user.role) {
            return res.status(403).json({ message: "접근 권한이 없습니다." });
        }

        console.log("병사 조회 성공:", soldierData);
        res.status(200).json(soldierData);

    } catch (err) {
        console.error("병사 조회 중 오류 발생:", err);
        res.status(500).json({ message: "서버 오류 발생" });
        next(err);
    }
}

/**전체 병사 리스트 조회 */
async function getAllSoldiers(req, res, next) {
    try {
        const adminRole = req.user.role;
        let range = [];

        //권한 분리
        switch (adminRole) {
            case "all":
                range = ["1소대", "2소대", "3소대"];
                break;
            case "1소대":
            case "2소대":
            case "3소대":
                range = [adminRole];
                break;
            default:
                return res.status(403).json({ message: "권한이 없습니다." });
        }

        //병사 목록 조회
        const list = await soldier.find({ unit: { $in: range } }).select("mId rank name unit -_id")

        //병사가 존재하지 않을 경우 예외처리
        if (list.length === 0) {
            return res.status(404).json({ message: "조회된 병사가 없습니다." });
        }

        console.log(list);
        res.status(200).json(list);
    } catch (err) {
        console.error("병사 조회 중 오류 발생:", err);
        res.status(500).json({ message: "서버에서 오류가 발생했습니다." });
        next(err);
    }
}

async function updateSoldier(req, res, next) {
    try {
        const { mId } = req.params;
        const updateData = req.body;

        const updatedSoldier = await soldier.findOneAndUpdate(
            { mId },
            { $set: updateData },
            { new: true, runValidators: true }
        );
        if (!updatedSoldier) {
            return res.status(404).json({ message: "해당 군번의 병사가 존재하지 않습니다." });
        }

        console.log("병사 정보 업데이트 완료:", updatedSoldier);
        res.status(200).json(updatedSoldier);
    } catch (err) {
        console.error("병사 정보 업데이트 중 오류 발생:", err);
        res.status(500).json({ message: "서버 오류 발생" });
        next(err);
    }
}

/**병사 모든 정보 삭제(cascade delete) */
async function deleteSoldier(req, res, next) {
    try {

        const { mId } = req.params;
        const soldierData = await soldier.findOne({ mId });

        //선택 병사 정보 확인
        if (!soldierData) {
            return res.status(404).json({ message: "해당 군번의 병사가 존재하지 않습니다." });
        }

        //권한 확인
        if (req.user.role !== "all" && soldierData.unit !== req.user.role) {
            return res.status(403).json({ message: "접근 권한이 없습니다." });
        }

        //병사정보 삭제
        await soldier.deleteOne({ mId });

        //관련기록 삭제
        await Pscore.deleteMany({ mId });
        await Bscore.deleteMany({ mId });
        await Mscore.deleteMany({ mId });
        await record.deleteMany({ mId });


        console.log(`병사 ${mId} 삭제 완료 (관련 기록 및 점수 삭제 포함)`);
        res.status(200).json({ message: `병사 ${mId} 삭제 완료 (관련 기록 및 점수 삭제 포함)` });


    } catch (err) {
        console.error("병사 삭제 중 오류 발생:", err);
        res.status(500).json({ message: "서버 오류 발생" });
        next(err);
    }
}
