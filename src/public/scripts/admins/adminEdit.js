document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");

    async function fetchAdminInfo() {
        try {
            const response = await fetch("http://localhost:8000/admins/me", { // ✅ 변경된 라우트 반영
                headers: { "Authorization": `Bearer ${token}` }
            });

            const data = await response.json();
            if (response.ok) {
                document.getElementById("position").value = data.position;
                document.getElementById("rank").value = data.rank;
                document.getElementById("name").value = data.name;
            } else {
                alert("관리자 정보를 불러오는데 실패했습니다.");
            }
        } catch (error) {
            alert("관리자 정보를 불러오는데 실패했습니다.");
        }
    }

    await fetchAdminInfo();

    document.getElementById("updateAdminForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const updatedData = {
            position: document.getElementById("position").value,
            rank: document.getElementById("rank").value,
            name: document.getElementById("name").value
        };

        await fetch("http://localhost:8000/admins/me", { // ✅ 변경된 라우트 반영
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updatedData)
        });

        alert("관리자 정보가 수정되었습니다.");
        window.location.href = "/soldiers.html";
    });
    // ✅ "비밀번호 변경" 버튼 클릭 시 모달 열기
    document.getElementById("changePasswordBtn").addEventListener("click", function () {
        document.getElementById("passwordModal").style.display = "block";
    });

    // ✅ "취소" 버튼 클릭 시 이전 페이지로 이동
    document.getElementById("cancelBtn").addEventListener("click", function () {
        window.history.back();
    });

    // ✅ 비밀번호 변경 요청
    document.getElementById("submitPasswordChange").addEventListener("click", async function () {
        const currentPassword = document.getElementById("currentPassword").value;
        const newPassword = document.getElementById("newPassword").value;

        try {
            const response = await fetch("http://localhost:8000/admins/pwd", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            if (response.ok) {
                alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
                localStorage.removeItem("token"); // 로그아웃 처리
                window.location.href = "/login.html";
            } else {
                alert("비밀번호 변경에 실패했습니다.");
            }
        } catch (error) {
            alert("비밀번호 변경에 실패했습니다.");
        }
    });

    // ✅ 비밀번호 변경 모달 닫기
    document.getElementById("closeModal").addEventListener("click", function () {
        document.getElementById("passwordModal").style.display = "none";
    });
});
