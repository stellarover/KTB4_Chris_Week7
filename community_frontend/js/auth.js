const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");

const loginMessage = document.querySelector("#login-message");
const signupMessage = document.querySelector("#signup-message");

const API_BASE_URL = "http://localhost:8080";

// 로그인
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.querySelector("#login-email").value.trim();
  const password = document.querySelector("#login-password").value;

  loginMessage.textContent = "로그인 요청 중입니다.";
  loginMessage.className = "message";

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const result = await response.text();

    if (!response.ok) {
      throw new Error(result || "로그인에 실패했습니다.");
    }

    console.log("로그인 응답:", result);

    loginMessage.textContent = result;
    loginMessage.className = "message success-message";

    window.location.href = "./posts.html";
  } catch (error) {
    console.error("로그인 오류:", error);

    loginMessage.textContent =
      error.message || "로그인 요청 중 오류가 발생했습니다.";
    loginMessage.className = "message error-message";
  }
});

// 회원가입
signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.querySelector("#signup-email").value.trim();
  const password = document.querySelector("#signup-password").value;
  const nickname = document.querySelector("#signup-nickname").value.trim();

  signupMessage.textContent = "회원가입 요청 중입니다.";
  signupMessage.className = "message";

  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        nickname: nickname,
      }),
    });

    const result = await response.text();

    if (!response.ok) {
      throw new Error(result || "회원가입에 실패했습니다.");
    }

    console.log("회원가입 응답:", result);

    signupMessage.textContent = result;
    signupMessage.className = "message success-message";

    signupForm.reset();
  } catch (error) {
    console.error("회원가입 오류:", error);

    signupMessage.textContent =
      error.message || "회원가입 요청 중 오류가 발생했습니다.";
    signupMessage.className = "message error-message";
  }
});
