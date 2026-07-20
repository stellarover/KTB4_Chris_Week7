const API_BASE_URL = "http://localhost:8080";

const request = async (path, options = {}) => {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,

      headers: {
        ...(options.body
          ? {
              "Content-Type": "application/json",
            }
          : {}),

        ...(options.headers ?? {}),
      },
    });
  } catch (error) {
    console.error("서버 연결 오류:", error);

    throw new Error("백엔드 서버에 연결할 수 없습니다.");
  }

  // DELETE 성공처럼 응답 본문이 없는 경우
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";

  let result;

  if (contentType.includes("application/json")) {
    result = await response.json();
  } else {
    result = await response.text();
  }

  if (!response.ok) {
    const errorMessage =
      typeof result === "string"
        ? result
        : result?.detail || result?.message || "요청 처리에 실패했습니다.";

    throw new Error(errorMessage);
  }

  return result;
};

export const login = (data) => {
  return request("/login", {
    method: "POST",

    body: JSON.stringify(data),
  });
};

export const signup = (data) => {
  return request("/signup", {
    method: "POST",

    body: JSON.stringify(data),
  });
};

export const getPosts = () => {
  return request("/posts");
};

export const getPost = (id) => {
  return request(`/posts/${encodeURIComponent(id)}`);
};

export const createPost = (data) => {
  return request("/posts", {
    method: "POST",

    body: JSON.stringify(data),
  });
};

export const updatePost = (id, data) => {
  return request(`/posts/${encodeURIComponent(id)}`, {
    method: "PATCH",

    body: JSON.stringify(data),
  });
};

export const deletePost = (id) => {
  return request(`/posts/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
};
