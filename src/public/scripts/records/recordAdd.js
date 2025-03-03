document.getElementById("recordAddForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const mId = urlParams.get("mId");

    const newRecord = {
        mId: mId,
        date: document.getElementById("date").value,
        interviewer: document.getElementById("interviewer").value,
        type: document.getElementById("type").value,
        priority: document.getElementById("priority").value,
        content: document.getElementById("content").value
    };

    const token = localStorage.getItem("token");

    const response = await fetch("/records", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newRecord)
    });

    if (response.ok) {
        alert("면담 기록이 추가되었습니다.");
        window.location.href = `/records.html?mId=${mId}`;
    } else {
        alert("면담 기록 추가 실패.");
    }
});

// ✅ 취소 버튼 (면담 리스트로 이동)
document.getElementById("cancelBtn").addEventListener("click", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mId = urlParams.get("mId");
    window.location.href = `/records.html?mId=${mId}`;
});