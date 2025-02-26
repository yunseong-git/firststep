document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mId = urlParams.get("mId");

    if (!mId) {
        console.error("❌ 오류: mId가 없습니다.");
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
        const response = await fetch(`http://localhost:8000/records/${mId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 403) {
                alert("⚠️ 권한이 없습니다. 용사 상세 페이지로 이동합니다.");
                window.location.href = `/soldierDetail.html?mId=${mId}`;
                return;
            } else {
                console.error("❌ 면담 기록 조회 실패:", response.statusText);
                return;
            }
        }

        const data = await response.json();
        const tableBody = document.getElementById("recordTable");

        if (!data || !data.records || data.records.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='5'>면담 기록이 없습니다.</td></tr>";
        } else {
            tableBody.innerHTML = "";
            data.records.forEach(record => {
                let row = document.createElement("tr");

                row.innerHTML = `
                    <td>${new Date(record.date).toLocaleDateString()}</td>
                    <td>${record.interviewer}</td>
                    <td>${translateType(record.type)}</td>  <!-- ✅ 한글 변환 적용 -->
                    <td>${record.priority}</td>
                    <td>
                        <button class="view-btn" data-record-id="${record._id}">조회</button>
                        <button class="edit-btn" data-record-id="${record._id}">수정</button>
                    </td>
                `;

                tableBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error("❌ 면담 기록 조회 중 오류 발생:", error);
    }

    // ✅ "면담 기록 추가" 버튼 이벤트 리스너 추가
    const addRecordButton = document.getElementById("addRecord");
    if (addRecordButton) {
        addRecordButton.addEventListener("click", function () {
            window.location.href = `/recordAdd.html?mId=${mId}`;
        });
    } else {
        console.warn("⚠️ addRecordButton 요소를 찾을 수 없습니다."); // 에러 대신 경고 로그
    }

    // ✅ "뒤로가기" 버튼 이벤트 리스너 추가
    const backButton = document.getElementById("backButton");
    if (backButton) {
        backButton.addEventListener("click", function () {
            window.location.href = `/soldierDetail.html?mId=${mId}`;
        });
    } else {
        console.warn("⚠️ backButton 요소를 찾을 수 없습니다.");
    }

    // ✅ "조회" & "수정" 버튼 클릭 이벤트 리스너 추가 (이벤트 위임 사용)
    document.getElementById("recordTable").addEventListener("click", function (event) {
        const button = event.target;
        const recordId = button.getAttribute("data-record-id");

        if (button.classList.contains("view-btn")) {
            window.location.href = `/recordDetail.html?mId=${mId}&recordId=${recordId}`;
        } else if (button.classList.contains("edit-btn")) {
            window.location.href = `/recordEdit.html?mId=${mId}&recordId=${recordId}`;
        }
    });
});