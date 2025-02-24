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
        window.location.href = "/soldiers.html";
    } else {
        alert(data.message || "로그인 실패");
    }
});