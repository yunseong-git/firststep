document.addEventListener("DOMContentLoaded", function () {
    fetchSoldiers(); // ✅ 용사 목록 불러오기

    // ✅ "용사 전입" 버튼 클릭 이벤트 추가
    const addSoldierButton = document.getElementById("addSoldierBtn");
    if (addSoldierButton) {
        addSoldierButton.addEventListener("click", function () {
            window.location.href = "/soldierAdd.html";
        });
    } else {
        console.error("❌ addSoldierBtn 요소를 찾을 수 없습니다.");
    }

    // ✅ "이전 페이지" 및 "다음 페이지" 버튼 클릭 이벤트 추가
    const prevPageButton = document.getElementById("prevPageButton");
    const nextPageButton = document.getElementById("nextPageButton");

    if (prevPageButton) prevPageButton.addEventListener("click", goToPrevPage);
    else console.error("❌ prevPageButton 요소를 찾을 수 없습니다.");

    if (nextPageButton) nextPageButton.addEventListener("click", goToNextPage);
    else console.error("❌ nextPageButton 요소를 찾을 수 없습니다.");

    // ✅ 소대 필터 버튼 이벤트 리스너 추가
    document.querySelectorAll(".unit-btn").forEach(button => {
        button.addEventListener("click", function () {
            const unit = this.getAttribute("data-unit");
            window.location.href = `/soldiers.html?unit=${encodeURIComponent(unit)}`; // ✅ 선택한 소대를 URL에 반영
        });
    });
});

async function fetchSoldiers() {
    try {
        const token = localStorage.getItem("token");
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get("page") || 1;
        const unit = urlParams.get("unit") || "all"; // ✅ 현재 필터된 소대 유지

        let url = `/soldiers?page=${page}&unit=${encodeURIComponent(unit)}`;

        console.log("✅ 요청 URL:", url); // 요청 URL 로그 출력

        const response = await fetch(url, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            console.error(`❌ 용사 목록 조회 실패: ${response.status} - ${response.statusText}`);
            return;
        }

        const data = await response.json();
        console.log("✅ 서버 응답 데이터:", data); // 서버 응답 구조 확인

        if (!data.soldiers || !Array.isArray(data.soldiers)) {
            console.error("❌ 데이터 구조 오류: soldiers 배열이 없습니다.");
            return;
        }

        const tableBody = document.getElementById("soldierTable");
        tableBody.innerHTML = "";

        if (data.soldiers.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='5'>용사 정보가 없습니다.</td></tr>";
            return;
        }

        data.soldiers.forEach(soldier => {
            let row = document.createElement("tr");

            row.innerHTML = `
                <td>${soldier.mId}</td>
                <td>${soldier.unit}</td>
                <td>${soldier.rank}</td>
                <td>${soldier.name}</td>
                <td><button class="view-btn" data-mId="${soldier.mId}">조회</button></td>
            `;

            tableBody.appendChild(row);
        });

        // ✅ 모든 "조회" 버튼에 이벤트 리스너 추가
        document.querySelectorAll(".view-btn").forEach(button => {
            button.addEventListener("click", function () {
                const mId = this.getAttribute("data-mId");
                window.location.href = `/soldierDetail.html?mId=${mId}`;
            });
        });

        // ✅ 페이지 번호 업데이트
        document.getElementById("currentPage").textContent = page;
        document.getElementById("totalPages").textContent = data.totalPages || 1;

    } catch (error) {
        console.error("❌ 용사 목록 조회 중 오류 발생:", error);
    }
}

// ✅ 다음 페이지 이동 (소대 필터 유지)
function goToNextPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get("page")) || 1;
    const unit = urlParams.get("unit") || "all"; // ✅ 소대 필터 유지
    window.location.href = `/soldiers.html?page=${currentPage + 1}&unit=${encodeURIComponent(unit)}`;
}

// ✅ 이전 페이지 이동 (소대 필터 유지)
function goToPrevPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get("page")) || 1;
    const unit = urlParams.get("unit") || "all"; // ✅ 소대 필터 유지
    const prevPage = Math.max(currentPage - 1, 1);
    window.location.href = `/soldiers.html?page=${prevPage}&unit=${encodeURIComponent(unit)}`;
}