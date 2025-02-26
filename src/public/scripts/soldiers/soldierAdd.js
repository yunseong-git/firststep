document.getElementById("addSoldierForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const newSoldier = {
        mId: document.getElementById("mId").value,
        unit: document.getElementById("unit").value,
        rank: document.getElementById("rank").value,
        name: document.getElementById("name").value,
        startDate: document.getElementById("startDate").value,
        endDate: document.getElementById("endDate").value,
        specialty: document.getElementById("specialty").value,
        specialtyCode: document.getElementById("specialtyCode").value,
        position: document.getElementById("position").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        height: document.getElementById("height").value,
        hobby: document.getElementById("hobby").value
    };

    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:8000/soldiers/newSoldier", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newSoldier)
    });

    if (response.ok) {
        alert("용사 등록이 완료되었습니다.");
        window.location.href = "/soldiers.html";
    } else {
        const errorData = await response.json();
        alert(errorData.message || "용사 등록에 실패했습니다.");
    }
});

// 취소 버튼 클릭 시 목록으로 돌아가기
document.getElementById("cancelButton").addEventListener("click", function () {
    window.location.href = "/soldiers.html";
});