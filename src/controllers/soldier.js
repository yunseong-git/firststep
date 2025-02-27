import { soldier } from "../models/soldier.js";

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
async function getSoldierDetail(req, res, next) {
    try {
        const { mId } = req.params;
        const soldierData = await soldier.findOne({ mId }).select("-_id");

        if (!soldierData) {
            return res.status(404).json({ message: "해당 군번의 병사가 존재하지 않습니다." });
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
        const { unit, page = 1 } = req.query;
        const { skip, limit } = req.pagination;

        // ✅ 유닛 필터 설정
        let filter = unit && unit !== "all" ? { unit } : {};

        // ✅ 병사 목록 조회
        const list = await soldier
            .find(filter)
            .select("mId rank name unit -_id")
            .sort({ unit: 1, mId: 1 })
            .skip(skip)
            .limit(limit);

        const totalSoldiers = await soldier.countDocuments(filter);

        // ✅ 병사가 없어도 200 OK 반환
        res.status(200).json({
            page,
            limit,
            totalPages: Math.ceil(totalSoldiers / limit),
            totalSoldiers,
            soldiers: list || [] // ✅ 빈 배열 반환
        });
    } catch (err) {
        console.error("병사 조회 중 오류 발생:", err);
        res.status(500).json({ message: "서버에서 오류가 발생했습니다." });
        next(err);
    }
}

/** 용사 정보 업데이트 */
async function updateSoldier(req, res, next) {
    try {
        const { mId } = req.params;
        const allowedUpdates = ["rank", "phoneNumber", "height", "hobby"];
        const updateFields = {};

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateFields[field] = req.body[field];
            }
        });

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "업데이트할 정보가 없습니다." });
        }

        const updatedSoldier = await soldier.findOneAndUpdate(
            { mId },
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedSoldier) {
            return res.status(404).json({ message: "해당 군번의 용사가 존재하지 않습니다." });
        }

        console.log("용사 정보 업데이트 완료:", updatedSoldier);
        res.status(200).json(updatedSoldier);
    } catch (err) {
        console.error("용사 정보 업데이트 중 오류 발생:", err);
        res.status(500).json({ message: "서버 오류 발생" });
        next(err);
    }
}

export const soldierController = {
    saveSoldier,
    getSoldierDetail,
    getAllSoldiers,
    updateSoldier,
};
