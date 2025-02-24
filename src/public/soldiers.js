document.addEventListener("DOMContentLoaded", () => {
    fetchSoldiers("all"); // 기본값: 전체 병사 불러오기

    // ✅ 버튼 이벤트 리스너 추가 (Unit 필터 기능)
    document.getElementById("btn-1소대").addEventListener("click", () => fetchSoldiers("1소대"));
    document.getElementById("btn-2소대").addEventListener("click", () => fetchSoldiers("2소대"));
    document.getElementById("btn-3소대").addEventListener("click", () => fetchSoldiers("3소대"));
    document.getElementById("btn-all").addEventListener("click", () => fetchSoldiers("all"));

    // ✅ 페이지네이션 버튼 추가
    document.getElementById("prevPage").addEventListener("click", () => changePage(-1));
    document.getElementById("nextPage").addEventListener("click", () => changePage(1));
});

let currentPage = 1;
const limit = 20;
let currentUnit = "all";

async function fetchSoldiers(unit = "all", page = 1) {
    currentUnit = unit;
    currentPage = page;
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:8000/soldiers?unit=${unit}&page=${page}&limit=${limit}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (!response.ok) {
        console.error("Error fetching soldiers:", response.statusText);
        return;
    }

    const data = await response.json();
    const tableBody = document.getElementById("soldierTable");
    if (!tableBody) {
        console.error("Element with id 'soldierTable' not found.");
        return;
    }
    tableBody.innerHTML = "";

    data.soldiers.forEach(soldier => {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${soldier.mId}</td>
            <td>${soldier.unit}</td>
            <td>${soldier.rank}</td>
            <td>${soldier.name}</td>
            <td><button class="detail-btn" data-mId="${soldier.mId}">조회</button></td>
        `;

        tableBody.appendChild(row);
    });

    document.getElementById("currentPage").innerText = data.page;
    document.getElementById("totalPages").innerText = data.totalPages;

    // ✅ "조회" 버튼에 이벤트 리스너 추가
    document.querySelectorAll(".detail-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            const mId = event.target.getAttribute("data-mId");
            viewDetail(mId);
        });
    });

    // ✅ 버튼 활성화/비활성화 설정
    document.getElementById("prevPage").disabled = currentPage <= 1;
    document.getElementById("nextPage").disabled = currentPage >= data.totalPages;
}

function changePage(offset) {
    fetchSoldiers(currentUnit, currentPage + offset);
}

function viewDetail(mId) {
    window.location.href = `/soldierDetail.html?mId=${mId}`;
}