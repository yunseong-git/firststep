async function fetchSoldierDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const mId = urlParams.get("mId");

    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8000/soldiers/detail/${mId}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const soldier = await response.json();

    // ✅ 날짜 형식을 'YYYY-MM-DD'로 변환
    const formatDate = (dateString) => {
        return new Date(dateString).toISOString().split("T")[0];
    };

    document.getElementById("soldierInfo").innerHTML = `
        <p><strong>군번:</strong> ${soldier.mId}</p>
        <p><strong>이름:</strong> ${soldier.name}</p>
        <p><strong>계급:</strong> ${soldier.rank}</p>
        <p><strong>소속:</strong> ${soldier.unit}</p>
        <p><strong>입대일:</strong> ${formatDate(soldier.startDate)}</p>
        <p><strong>전역일:</strong> ${formatDate(soldier.endDate)}</p>
        <p><strong>주특기:</strong> ${soldier.specialty} (${soldier.specialtyCode})</p>
        <p><strong>직책:</strong> ${soldier.position}</p>
        <p><strong>전화번호:</strong> ${soldier.phoneNumber}</p>
        <p><strong>키:</strong> ${soldier.height}cm</p>
        <p><strong>취미:</strong> ${soldier.hobby}</p>
        <button id="editButton">정보수정</button>
    `;

    document.getElementById("editButton").addEventListener("click", () => {
        window.location.href = `/soldierEdit.html?mId=${mId}`;
    });

    // ✅ "면담 기록" 버튼 클릭 시 면담 기록 페이지로 이동
document.getElementById("recordButton").addEventListener("click", () => {
    window.location.href = `/records.html?mId=${encodeURIComponent(mId)}`;
});
}



document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("backButton").addEventListener("click", function () {
        window.location.href = "/soldiers.html"; // 목록 페이지로 이동
    });

});

fetchSoldierDetail();