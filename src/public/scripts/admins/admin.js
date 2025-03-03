document.addEventListener("DOMContentLoaded", function () {
    fetchAdmins(); // 페이지 로드 시 관리자 리스트 불러오기

    document.getElementById("addAdminBtn").addEventListener("click", function () {
        document.getElementById("addAdminModal").style.display = "block";
    });

    document.querySelector(".close").addEventListener("click", function () {
        document.getElementById("addAdminModal").style.display = "none";
    });

    document.getElementById("addAdminForm").addEventListener("submit", async function (event) {
        event.preventDefault();
        await registerAdmin();
    });

    const backButton = document.getElementById("backToList");
    if (backButton) {
        backButton.addEventListener("click", () => {
            window.location.href = "/soldiers.html";
        });
    }
});

async function fetchAdmins() {
    const token = localStorage.getItem("token");
    const response = await fetch("/roots/list", { // ✅ 변경된 라우트 반영
        headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await response.json();
    const tableBody = document.getElementById("adminTable");
    tableBody.innerHTML = "";

    data.forEach(admin => {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${admin.mId}</td>
            <td>${admin.name}</td>
            <td>${admin.rank}</td>
            <td>${admin.position}</td>
            <td>${admin.unit}</td>
            <td>
                <button class="reset-btn" data-mId="${admin.mId}">비밀번호 분실</button>
                <button class="change-unit-btn" data-mId="${admin.mId}" data-unit="${admin.unit}">소속 변경</button>
                <button class="delete-btn" data-mId="${admin.mId}">관리자 삭제</button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    // ✅ 버튼 이벤트 리스너 추가
    document.querySelectorAll(".reset-btn").forEach(button => {
        button.addEventListener("click", event => {
            const mId = event.target.getAttribute("data-mId");
            resetPassword(mId);
        });
    });

    document.querySelectorAll(".change-unit-btn").forEach(button => {
        button.addEventListener("click", event => {
            const mId = event.target.getAttribute("data-mId");
            const currentUnit = event.target.getAttribute("data-unit");
            changeUnit(mId, currentUnit);
        });
    });

    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", event => {
            const mId = event.target.getAttribute("data-mId");
            deleteAdmin(mId);
        });
    });
}

async function resetPassword(mId) {
    if (!mId) {
        alert("관리자 ID가 없습니다. 다시 시도하세요.");
        return;
    }

    if (!confirm("경고! 정말 초기화하시겠습니까? 적용 후 되돌릴 수 없습니다.")) return;

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`/roots/pwd/${mId}`, { // ✅ 변경된 라우트 반영
            method: "PATCH",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const result = await response.json();
        if (response.ok) {
            alert("비밀번호가 초기화되었습니다.");
        } else {
            alert("비밀번호 초기화 실패: " + result.message);
        }
    } catch (error) {
        console.error("❌ 비밀번호 초기화 요청 중 오류 발생:", error);
        alert("비밀번호 초기화 중 오류가 발생했습니다.");
    }
}

async function changeUnit(mId, currentUnit) {
    const newUnit = prompt(`현재 소속: ${currentUnit}\n변경할 소속을 입력하세요 (1소대, 2소대, 3소대, all)`);
    if (!newUnit) return;

    const token = localStorage.getItem("token");
    await fetch("/roots/unit", { // ✅ 변경된 라우트 반영
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ mId, newUnit })
    });

    alert("소속이 변경되었습니다.");
    fetchAdmins();
}

async function deleteAdmin(mId) {
    if (!confirm("경고! 정말 삭제하시겠습니까? 적용 후 되돌릴 수 없습니다.")) return;

    const token = localStorage.getItem("token");
    const response = await fetch("/roots", { // ✅ 변경된 라우트 반영
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ mId })
    });

    if (response.ok) {
        alert("관리자가 삭제되었습니다.");
        fetchAdmins();
    } else {
        alert("관리자 삭제 실패.");
    }
}

async function registerAdmin() {
    const newAdmin = {
        mId: document.getElementById("newMId").value,
        password: document.getElementById("newPassword").value,
        name: document.getElementById("newName").value,
        rank: document.getElementById("newRank").value,
        position: document.getElementById("newPosition").value,
        unit: document.getElementById("newUnit").value
    };

    const token = localStorage.getItem("token");
    const response = await fetch("/roots/newAdmin", { // ✅ 변경된 라우트 반영
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newAdmin)
    });

    if (response.ok) {
        alert("신규 관리자가 등록되었습니다.");
        document.getElementById("addAdminModal").style.display = "none";
        fetchAdmins();
    } else {
        alert("관리자 등록 실패.");
    }
}

