async function fetchSoldierData() {
    const urlParams = new URLSearchParams(window.location.search);
    const mId = urlParams.get("mId");

    if (!mId) {
        console.error("mId가 URL에 없음");
        alert("잘못된 접근입니다.");
        return;
    }

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`/soldiers/detail/${mId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error("용사 정보를 불러올 수 없습니다.");
        }

        const soldier = await response.json();

        // ✅ 기존 값이 잘 들어가는지 콘솔로 확인
        console.log("불러온 용사 정보:", soldier);

        // ✅ 폼 필드에 기존 값 채우기
        document.querySelector("#rank").value = soldier.rank || "";
        document.querySelector("#phoneNumber").value = soldier.phoneNumber || "";
        document.querySelector("#height").value = soldier.height || "";
        document.querySelector("#hobby").value = soldier.hobby || "";

    } catch (error) {
        console.error("용사 정보 조회 실패:", error);
        alert("용사 정보를 불러오는데 실패했습니다.");
    }
}

// ✅ 정보 수정 (폼 제출)
document.querySelector("#updateForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const mId = urlParams.get("mId");

    if (!mId) {
        console.error("mId가 URL에 없음");
        alert("잘못된 접근입니다.");
        return;
    }

    const updatedData = {
        rank: document.querySelector("#rank").value,
        phoneNumber: document.querySelector("#phoneNumber").value,
        height: document.querySelector("#height").value,
        hobby: document.querySelector("#hobby").value,
    };

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`/soldiers/updateSoldier/${mId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            alert("용사 정보가 성공적으로 수정되었습니다.");
            window.location.href = `/soldierDetail.html?mId=${mId}`;
        } else {
            alert("정보 수정에 실패했습니다.");
        }
    } catch (error) {
        console.error("용사 정보 업데이트 실패:", error);
        alert("정보 수정 중 오류 발생.");
    }
});

// ✅ 취소 버튼 (수정 페이지 → 상세 페이지 이동)
document.querySelector("#cancelButton").addEventListener("click", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mId = urlParams.get("mId");

    if (!mId) {
        console.error("mId가 URL에 없음");
        alert("잘못된 접근입니다.");
        return;
    }

    console.log("취소 버튼 클릭됨, 이동할 페이지:", `/soldierDetail.html?mId=${mId}`);
    window.location.href = `/soldierDetail.html?mId=${mId}`;
});

// ✅ 페이지 로드 후 기존 데이터 불러오기
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded 이벤트 발생, 용사 정보 로드 시작");
    fetchSoldierData();
});