document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mId = urlParams.get("mId");
    const recordId = urlParams.get("recordId");

    console.log("✅ 수정 요청 - mId:", mId);
    console.log("✅ 수정 요청 - recordId:", recordId);

    if (!mId || !recordId) {
        console.error("❌ 오류: mId 또는 recordId가 없습니다.");
        alert("오류: mId 또는 recordId가 없습니다.");
        window.history.back();
        return;
    }

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`http://localhost:8000/records/${mId}/${recordId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            console.error("❌ 면담 기록 불러오기 실패:", response.statusText);
            return;
        }

        const data = await response.json();
        console.log("✅ 불러온 면담 기록 데이터:", data);

        document.getElementById("date").value = new Date(data.date).toISOString().split("T")[0];
        document.getElementById("interviewer").value = data.interviewer;
        document.getElementById("type").value = data.type;
        document.getElementById("priority").value = data.priority;
        document.getElementById("content").value = data.content;
    } catch (error) {
        console.error("❌ 면담 기록 불러오기 중 오류 발생:", error);
    }

    // ✅ "수정 완료" 버튼 클릭 이벤트 추가 (버튼이 null인지 확인)
    const saveChangesButton = document.getElementById("saveChangesButton");

    if (!saveChangesButton) {
        console.error("❌ saveChangesButton 요소를 찾을 수 없습니다.");
        return;
    }

    saveChangesButton.addEventListener("click", async function () {
        const updatedRecord = {
            date: document.getElementById("date").value,
            interviewer: document.getElementById("interviewer").value,
            type: document.getElementById("type").value,
            priority: parseInt(document.getElementById("priority").value),
            content: document.getElementById("content").value
        };

        console.log("✅ 수정 데이터:", updatedRecord);

        try {
            const response = await fetch(`http://localhost:8000/records/${mId}/${recordId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updatedRecord)
            });

            const result = await response.json();
            if (response.ok) {
                alert("면담 기록이 수정되었습니다.");
                window.location.href = `/recordDetail.html?mId=${mId}&recordId=${recordId}`;
            } else {
                console.error("❌ 수정 요청 실패:", result);
                alert("면담 기록 수정 실패: " + result.message);
            }
        } catch (error) {
            console.error("❌ 수정 요청 중 오류 발생:", error);
        }
    });
    // ✅ "취소" 버튼 클릭 시 이전 페이지로 이동
    document.getElementById("cancelButton").addEventListener("click", function () {
        window.history.back();
    });
});