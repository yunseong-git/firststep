const apiUrl = "http://localhost:8000/note"; // 백엔드 API 주소 (포트 확인)

// 📌 노트 리스트 가져오기
async function loadNotes() {
    const response = await fetch(apiUrl);
    const notes = await response.json();

    const noteList = document.getElementById("noteList");
    noteList.innerHTML = ""; // 기존 리스트 초기화

    
    notes.forEach(note => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <span>${note.title}</span>
            <a href="note.html?id=${note._id}">보기</a>
        `;
        noteList.appendChild(listItem);
    });
}

// 📌 노트 추가하기
document.getElementById("addNoteForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
    });

    location.reload();
});

// 📌 노트 상세 정보 가져오기
async function loadNoteDetail() {
    const params = new URLSearchParams(window.location.search);
    const noteId = params.get("id");

    if (!noteId) return;

    const response = await fetch(`${apiUrl}/${noteId}`);
    const note = await response.json();

    document.getElementById("noteTitle").innerText = note.title;
    document.getElementById("noteContent").innerText = note.content;
    document.getElementById("editTitle").value = note.title;
    document.getElementById("editContent").value = note.content;
}

// 📌 노트 수정하기
document.getElementById("editNoteForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const noteId = params.get("id");

    const title = document.getElementById("editTitle").value;
    const content = document.getElementById("editContent").value;

    await fetch(`${apiUrl}/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
    });

    alert("노트가 수정되었습니다!");
    location.href = "index.html";
});

// 📌 노트 삭제하기
document.getElementById("deleteNote")?.addEventListener("click", async () => {
    const params = new URLSearchParams(window.location.search);
    const noteId = params.get("id");

    await fetch(`${apiUrl}/${noteId}`, {
        method: "DELETE",
    });

    alert("노트가 삭제되었습니다!");
    location.href = "index.html";
});

// 📌 초기 데이터 로드
if (document.getElementById("noteList")) {
    loadNotes();
} else if (document.getElementById("noteDetail")) {
    loadNoteDetail();
}