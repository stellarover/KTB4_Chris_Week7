const API_BASE_URL = "http://localhost:8080";

const updateForm = document.querySelector("#update-form");
const deleteButton = document.querySelector("#delete-button");
const detailMessage = document.querySelector("#detail-message");

const titleElement = document.querySelector("#post-title");
const authorElement = document.querySelector("#post-author");
const contentElement = document.querySelector("#post-content");

const updateTitle = document.querySelector("#update-title");
const updateContent = document.querySelector("#update-content");

// 커스텀 삭제 모달 요소
const deleteDialog = document.querySelector("#delete-dialog");
const cancelDeleteButton = document.querySelector("#cancel-delete-button");
const confirmDeleteButton = document.querySelector("#confirm-delete-button");

// URL에서 게시글 ID 가져오기
const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

console.log("커스텀 삭제 모달이 적용된 post_detail.js가 로드되었습니다.");

/**
 * 화면 메시지 출력
 */
const showMessage = (message, type = "") => {
  detailMessage.textContent = message;

  if (type === "success") {
    detailMessage.className = "message success-message";
    return;
  }

  if (type === "error") {
    detailMessage.className = "message error-message";
    return;
  }

  detailMessage.className = "message";
};

/**
 * 서버의 오류 응답에서 메시지 추출
 */
const getErrorMessage = async (response, fallbackMessage) => {
  try {
    const errorData = await response.json();

    return errorData.message || errorData.detail || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
};

/**
 * 게시글 상세 조회
 */
const loadPost = async () => {
  if (!postId) {
    showMessage("게시글 ID가 없습니다.", "error");
    updateForm.hidden = true;
    return;
  }

  showMessage("게시글을 불러오는 중입니다.");

  try {
    const response = await fetch(
      `${API_BASE_URL}/posts/${encodeURIComponent(postId)}`,
    );

    if (!response.ok) {
      const message = await getErrorMessage(
        response,
        "게시글을 불러오지 못했습니다.",
      );

      throw new Error(message);
    }

    const post = await response.json();

    console.log("게시글 상세 조회 성공:", post);

    titleElement.textContent = post.title;
    authorElement.textContent = `작성자: ${post.author}`;
    contentElement.textContent = post.content;

    updateTitle.value = post.title;
    updateContent.value = post.content;

    showMessage("");
  } catch (error) {
    console.error("게시글 상세 조회 오류:", error);

    showMessage(
      error.message || "게시글 조회 중 오류가 발생했습니다.",
      "error",
    );
  }
};

/**
 * 게시글 수정
 */
updateForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = updateTitle.value.trim();
  const content = updateContent.value.trim();

  if (!title || !content) {
    showMessage("제목과 내용을 모두 입력해주세요.", "error");
    return;
  }

  showMessage("게시글을 수정하는 중입니다.");

  try {
    const response = await fetch(
      `${API_BASE_URL}/posts/${encodeURIComponent(postId)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      },
    );

    if (!response.ok) {
      const message = await getErrorMessage(
        response,
        "게시글 수정에 실패했습니다.",
      );

      throw new Error(message);
    }

    const updatedPost = await response.json();

    console.log("게시글 수정 성공:", updatedPost);

    titleElement.textContent = updatedPost.title;
    contentElement.textContent = updatedPost.content;
    authorElement.textContent = `작성자: ${updatedPost.author}`;

    updateTitle.value = updatedPost.title;
    updateContent.value = updatedPost.content;

    showMessage("게시글 수정이 완료되었습니다.", "success");
  } catch (error) {
    console.error("게시글 수정 오류:", error);

    showMessage(
      error.message || "게시글 수정 중 오류가 발생했습니다.",
      "error",
    );
  }
});

/**
 * 삭제 버튼 클릭
 * 브라우저 기본 confirm이 아니라 커스텀 dialog를 연다.
 */
deleteButton.addEventListener("click", () => {
  deleteDialog.showModal();
});

/**
 * 삭제 취소
 */
cancelDeleteButton.addEventListener("click", () => {
  deleteDialog.close();
});

/**
 * 모달 바깥의 어두운 영역을 클릭하면 닫기
 */
deleteDialog.addEventListener("click", (event) => {
  if (event.target === deleteDialog) {
    deleteDialog.close();
  }
});

/**
 * 삭제 확인
 */
confirmDeleteButton.addEventListener("click", async () => {
  confirmDeleteButton.disabled = true;
  cancelDeleteButton.disabled = true;
  confirmDeleteButton.textContent = "삭제 중...";

  try {
    const response = await fetch(
      `${API_BASE_URL}/posts/${encodeURIComponent(postId)}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      const message = await getErrorMessage(
        response,
        "게시글 삭제에 실패했습니다.",
      );

      throw new Error(message);
    }

    console.log("게시글 삭제 성공");

    deleteDialog.close();

    showMessage("게시글이 삭제되었습니다.", "success");

    // 브라우저 기본 alert 없이 잠시 후 목록으로 이동
    setTimeout(() => {
      window.location.replace("./posts.html");
    }, 600);
  } catch (error) {
    console.error("게시글 삭제 오류:", error);

    deleteDialog.close();

    showMessage(
      error.message || "게시글 삭제 중 오류가 발생했습니다.",
      "error",
    );
  } finally {
    confirmDeleteButton.disabled = false;
    cancelDeleteButton.disabled = false;
    confirmDeleteButton.textContent = "확인";
  }
});

loadPost();
