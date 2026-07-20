const API_BASE_URL = "http://localhost:8080";

const createForm = document.querySelector("#create-form");
const createMessage = document.querySelector("#create-message");

createForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.querySelector("#create-title").value.trim();
  const content = document.querySelector("#create-content").value.trim();

  if (!title || !content) {
    createMessage.textContent = "제목과 내용을 모두 입력해주세요.";
    createMessage.className = "message error-message";
    return;
  }

  createMessage.textContent = "게시글을 작성하는 중입니다.";
  createMessage.className = "message";

  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
      }),
    });

    if (!response.ok) {
      throw new Error("게시글 작성에 실패했습니다.");
    }

    const createdPost = await response.json();

    console.log("게시글 작성 성공:", createdPost);

    createMessage.textContent = "게시글이 작성되었습니다.";
    createMessage.className = "message success-message";

    window.location.href = "./posts.html";
  } catch (error) {
    console.error("게시글 작성 오류:", error);

    createMessage.textContent = error.message;
    createMessage.className = "message error-message";
  }
});
