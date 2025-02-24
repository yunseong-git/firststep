async function fetchSoldierDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const mId = urlParams.get("mId");

    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8000/soldiers/detail/${mId}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const soldier = await response.json();
    document.getElementById("soldierInfo").innerHTML = `
        <p>군번: ${soldier.mId}</p>
        <p>이름: ${soldier.name}</p>
        <p>계급: ${soldier.rank}</p>
        <p>소속: ${soldier.unit}</p>
        <p>주특기: ${soldier.specialty} (${soldier.specialtyCode})</p>
    `;
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("backButton").addEventListener("click", function () {
        window.location.href = "/soldiers.html"; // 목록 페이지로 이동
    });
});

fetchSoldierDetail();