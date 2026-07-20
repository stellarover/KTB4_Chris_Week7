const postList = document.querySelector("#post-list");
const postsMessage = document.querySelector("#posts-message");

const API_BASE_URL = "http://localhost:8080";

const renderPosts = (posts) => {
  postList.innerHTML = "";

  if (posts.length === 0) {
    postList.innerHTML = "<p>등록된 게시글이 없습니다.</p>";
    return;
  }

  posts.forEach((post) => {
    const postItem = document.createElement("article");

    postItem.className = "post-item";

    postItem.innerHTML = `
      <h2>${post.title}</h2>
      <p>${post.content}</p>
      <p class="post-meta">작성자: ${post.author}</p>
    `;

    postItem.addEventListener("click", () => {
      window.location.href = `./post_detail.html?id=${post.id}`;
    });

    postList.appendChild(postItem);
  });
};

const loadPosts = async () => {
  postsMessage.textContent = "";
  postList.innerHTML = "<p>게시글을 불러오는 중입니다.</p>";

  try {
    const response = await fetch(`${API_BASE_URL}/posts`);

    if (!response.ok) {
      throw new Error("게시글 목록을 불러오지 못했습니다.");
    }

    const posts = await response.json();

    console.log("게시글 목록 응답:", posts);

    renderPosts(posts);
  } catch (error) {
    console.error("게시글 목록 조회 오류:", error);

    postList.innerHTML = "";
    postsMessage.textContent = error.message;
    postsMessage.className = "message error-message";
  }
};

loadPosts();
