document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const mId = document.getElementById("mId").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:8000/admins/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mId, password })
    });

    const data = await response.json();
    
    if (response.ok) {
        alert("로그인 성공");
        localStorage.setItem("token", data.token); // JWT 저장
        window.location.href = "/soldiers.html";  // 메인 페이지 이동
    } else {
        if (data.message.includes("비밀번호 변경이 필요")) {
            alert("비밀번호 변경이 필요합니다.");

            // ✅ 모달창 열기
            document.getElementById("passwordChangeModal").style.display = "block";

            // ✅ 로그인한 mId 저장 (비밀번호 변경 요청에 사용)
            document.getElementById("passwordChangeModal").dataset.mId = mId;
        } else {
            alert(data.message || "로그인 실패");
        }
    }
});
document.getElementById("changePasswordBtn").addEventListener("click", async function () {
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const mId = document.getElementById("passwordChangeModal").dataset.mId;

    if (newPassword !== confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }

    const response = await fetch("http://localhost:8000/admins/pwd/force", {  // ✅ 강제 변경 API 사용
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mId, currentPassword: mId, newPassword })  // ✅ 로그인 없이 변경하는 경우
    });

    const data = await response.json();
    if (response.ok) {
        alert("비밀번호가 성공적으로 변경되었습니다. 다시 로그인하세요.");
        document.getElementById("passwordChangeModal").style.display = "none"; // 모달 닫기
        window.location.href = "/login.html"; // 로그인 페이지로 이동
    } else {
        alert("비밀번호 변경 실패: " + data.message);
    }
});