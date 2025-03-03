document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mId = urlParams.get("mId");
    const recordId = urlParams.get("recordId");

    if (!mId || !recordId) {
        console.error("❌ 오류: mId 또는 recordId가 없습니다.");
        return;
    }

    const token = localStorage.getItem("token");

    // ✅ 면담 유형을 한글로 변환하는 함수
    function translateType(type) {
        const types = {
            regular: "정기",
            frequent: "수시",
            special: "특별"
        };
        return types[type] || "알 수 없음";
    }

    try {
        const response = await fetch(`/records/${mId}/${recordId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            console.error("❌ 면담 기록 조회 실패:", response.statusText);
            return;
        }

        const record = await response.json();

        document.getElementById("recordInfo").innerHTML = `
            <p><strong>날짜:</strong> ${new Date(record.date).toLocaleDateString()}</p>
            <p><strong>면담관:</strong> ${record.interviewer}</p>
            <p><strong>면담 유형:</strong> ${translateType(record.type)}</p>  <!-- ✅ 한글 변환 적용 -->
            <p><strong>중요도:</strong> ${record.priority}</p>
            <p><strong>내용:</strong> ${record.content}</p>
        `;
    } catch (error) {
        console.error("❌ 면담 기록 조회 중 오류 발생:", error);
    }

    // ✅ "뒤로가기" 버튼 이벤트 리스너 추가
    const backButton = document.getElementById("backButton");
    if (backButton) {
        backButton.addEventListener("click", function () {
            window.location.href = `/records.html?mId=${mId}`;
        });
    } else {
        console.warn("⚠️ backButton 요소를 찾을 수 없습니다.");
    }
});