document.addEventListener("DOMContentLoaded", async function () {
    let interval; // 전역 변수로 interval을 선언

    const navbar = document.createElement("div");
    navbar.innerHTML = `
        <div style="display: flex; justify-content: space-between; padding: 10px;">
            <span id="adminInfo">관리자 정보 로딩 중...</span>
            <div>
                <span id="tokenExpiryTime" style="margin-right: 15px;">남은 시간: --:--</span>
                <button id="refreshTokenBtn">로그인 연장</button>
                <button id="logoutBtn" style="margin-left: 10px;">로그아웃</button>
            </div>
        </div>
    `;
    document.body.prepend(navbar);

    function getTokenExpiration(token) {
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split(".")[1])); // JWT Payload 디코딩
            return { exp: payload.exp * 1000, mId: payload.mId }; // 만료시간 (ms) + 관리자 ID 반환
        } catch (error) {
            return null;
        }
    }

    async function fetchAdminInfo() {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8000/admins/me", {
                headers: { "Authorization": `Bearer ${token}` }
            });
    
            const data = await response.json();
            if (response.ok) {
                document.getElementById("adminInfo").textContent = `${data.rank} ${data.name} (${data.position})`;
            } else {
                document.getElementById("adminInfo").textContent = "관리자 정보 불러오기 실패";
            }
        } catch (error) {
            console.error("관리자 정보 조회 중 오류 발생:", error);
            document.getElementById("adminInfo").textContent = "관리자 정보 불러오기 실패";
        }
    }

    function updateTokenExpiryTime() {
        clearInterval(interval); // 기존 인터벌 제거

        const token = localStorage.getItem("token");
        const decoded = getTokenExpiration(token);
        if (!decoded || !decoded.exp) {
            document.getElementById("tokenExpiryTime").textContent = "남은 시간: 만료됨";
            return;
        }

        fetchAdminInfo(decoded.mId); // 관리자 정보 가져오기

        interval = setInterval(() => {
            const remainingTime = decoded.exp - Date.now();
            if (remainingTime <= 0) {
                clearInterval(interval);
                document.getElementById("tokenExpiryTime").textContent = "남은 시간: 만료됨";
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                localStorage.removeItem("token");
                window.location.href = "/login.html";
                return;
            }

            const minutes = Math.floor(remainingTime / 60000);
            const seconds = Math.floor((remainingTime % 60000) / 1000);
            document.getElementById("tokenExpiryTime").textContent = `남은 시간: ${minutes}분 ${seconds}초`;
        }, 1000);
    }

    updateTokenExpiryTime(); // 초기 실행

    // 로그아웃 버튼 클릭 이벤트
    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.removeItem("token"); // JWT 토큰 삭제
        alert("로그아웃되었습니다.");
        window.location.href = "/login.html"; // 로그인 페이지로 이동
    });

    // 로그인 연장 버튼 클릭 이벤트
    document.getElementById("refreshTokenBtn").addEventListener("click", async function () {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("로그인이 필요합니다.");
            window.location.href = "/login.html";
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/admins/refresh", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.newToken); // 새 토큰 저장
                alert("로그인 연장 완료!");
                updateTokenExpiryTime(); // 새로운 만료 시간 반영
            } else {
                alert(data.message || "로그인 연장 실패. 다시 로그인해주세요.");
                window.location.href = "/login.html";
            }
        } catch (error) {
            console.error("로그인 연장 중 오류 발생:", error);
            alert("로그인 연장 실패. 다시 로그인해주세요.");
            window.location.href = "/login.html";
        }
    });
});