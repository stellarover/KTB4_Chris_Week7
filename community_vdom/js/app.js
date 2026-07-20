import { h, render } from "./vdom.js";

import * as api from "./api.js";

import { navigate, startRouter } from "./router.js";

const root = document.querySelector("#app");

const MISSING_POST_MESSAGE = "삭제되었거나 존재하지 않는 게시글입니다.";

const state = {
  route: {
    name: "auth",
    path: "/login",
  },

  posts: [],
  selectedPost: null,

  loading: false,

  message: "",
  messageType: "",

  deleteModalOpen: false,
};

let flashMessage = null;

const queueFlashMessage = (message, type = "success") => {
  flashMessage = {
    message,
    type,
  };
};

const setState = (nextState) => {
  Object.assign(state, nextState);

  renderApp();
};

const getMessageClass = () => {
  if (state.messageType === "success") {
    return "message success-message";
  }

  if (state.messageType === "error") {
    return "message error-message";
  }

  return "message";
};

const Message = () => {
  if (!state.message) {
    return null;
  }

  return h(
    "p",
    {
      className: getMessageClass(),
      "aria-live": "polite",
    },
    state.message,
  );
};

const FormField = ({
  label,
  id,
  name,
  type = "text",
  value,
  placeholder = "",
  maxLength,
}) => {
  const inputProps = {
    id,
    name,
    required: true,
    placeholder,
  };

  if (value !== undefined) {
    inputProps.value = value;
  }

  if (maxLength !== undefined) {
    inputProps.maxLength = maxLength;
  }

  const control =
    type === "textarea"
      ? h("textarea", inputProps)
      : h("input", {
          ...inputProps,
          type,
        });

  return h(
    "div",
    {
      className: "form-group",
    },

    h(
      "label",
      {
        htmlFor: id,
      },
      label,
    ),

    control,
  );
};

const AuthView = () => {
  return h(
    "main",
    {
      className: "container",
    },

    h(
      "header",
      {
        className: "page-header",
      },

      h(
        "div",
        {},

        h(
          "p",
          {
            className: "eyebrow",
          },
          "V-DOM SPA Community",
        ),

        h("h1", {}, "커뮤니티"),
      ),
    ),

    h(
      "section",
      {
        className: "card",
      },

      h("h2", {}, "로그인"),

      h(
        "form",
        {
          onSubmit: (event) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);

            handleLogin({
              email: String(formData.get("email")).trim(),

              password: String(formData.get("password")),
            });
          },
        },

        FormField({
          label: "이메일",
          id: "login-email",
          name: "email",
          type: "email",
          placeholder: "이메일을 입력하세요.",
        }),

        FormField({
          label: "비밀번호",
          id: "login-password",
          name: "password",
          type: "password",
          placeholder: "비밀번호를 입력하세요.",
        }),

        h(
          "button",
          {
            type: "submit",
            disabled: state.loading,
          },
          state.loading ? "로그인 중..." : "로그인",
        ),
      ),
    ),

    h(
      "section",
      {
        className: "card",
      },

      h("h2", {}, "회원가입"),

      h(
        "form",
        {
          onSubmit: (event) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);

            handleSignup({
              email: String(formData.get("email")).trim(),

              password: String(formData.get("password")),

              nickname: String(formData.get("nickname")).trim(),
            });
          },
        },

        FormField({
          label: "이메일",
          id: "signup-email",
          name: "email",
          type: "email",
          placeholder: "이메일을 입력하세요.",
        }),

        FormField({
          label: "비밀번호",
          id: "signup-password",
          name: "password",
          type: "password",
          placeholder: "비밀번호를 입력하세요.",
        }),

        FormField({
          label: "닉네임",
          id: "signup-nickname",
          name: "nickname",
          placeholder: "닉네임을 입력하세요.",
        }),

        h(
          "button",
          {
            type: "submit",
            disabled: state.loading,
          },
          state.loading ? "처리 중..." : "회원가입",
        ),
      ),
    ),

    Message(),
  );
};

const PostCard = (post) => {
  const openPost = () => {
    navigate(`/posts/${post.id}`);
  };

  return h(
    "article",
    {
      className: "post-item",
      tabIndex: 0,

      onClick: openPost,

      onKeyDown: (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openPost();
        }
      },
    },

    h("h2", {}, post.title),

    h(
      "p",
      {
        className: "post-preview",
      },
      post.content,
    ),

    h(
      "p",
      {
        className: "post-meta",
      },
      `작성자: ${post.author}`,
    ),
  );
};

const PostsView = () => {
  return h(
    "main",
    {
      className: "container",
    },

    h(
      "header",
      {
        className: "page-header",
      },

      h("h1", {}, "게시글 목록"),

      h(
        "div",
        {
          className: "header-buttons",
        },

        h(
          "button",
          {
            type: "button",
            className: "secondary-button",

            onClick: handleLogout,
          },
          "로그아웃",
        ),

        h(
          "button",
          {
            type: "button",

            onClick: () => {
              navigate("/posts/new");
            },
          },
          "게시글 작성",
        ),
      ),
    ),

    state.loading
      ? h(
          "p",
          {
            className: "loading-message",
          },
          "게시글을 불러오는 중입니다.",
        )
      : null,

    !state.loading && state.posts.length === 0
      ? h(
          "section",
          {
            className: "card empty-state",
          },

          h("p", {}, "등록된 게시글이 없습니다."),
        )
      : null,

    h(
      "section",
      {
        className: "post-list",
      },

      state.posts.map((post) => PostCard(post)),
    ),

    Message(),
  );
};

const CreateView = () => {
  return h(
    "main",
    {
      className: "container",
    },

    h(
      "header",
      {
        className: "page-header",
      },

      h("h1", {}, "게시글 작성"),

      h(
        "button",
        {
          type: "button",
          className: "secondary-button",

          onClick: () => {
            navigate("/posts");
          },
        },
        "목록으로",
      ),
    ),

    h(
      "section",
      {
        className: "card",
      },

      h(
        "form",
        {
          onSubmit: (event) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);

            handleCreatePost({
              title: String(formData.get("title")).trim(),

              content: String(formData.get("content")).trim(),
            });
          },
        },

        FormField({
          label: "제목",
          id: "create-title",
          name: "title",
          placeholder: "제목을 입력하세요.",
          maxLength: 255,
        }),

        FormField({
          label: "내용",
          id: "create-content",
          name: "content",
          type: "textarea",
          placeholder: "내용을 입력하세요.",
        }),

        h(
          "button",
          {
            type: "submit",
            disabled: state.loading,
          },
          state.loading ? "작성 중..." : "작성",
        ),
      ),

      Message(),
    ),
  );
};

const DeleteModal = () => {
  if (!state.deleteModalOpen) {
    return null;
  }

  return h(
    "div",
    {
      className: "modal-backdrop",

      onClick: () => {
        setState({
          deleteModalOpen: false,
        });
      },
    },

    h(
      "section",
      {
        className: "modal-card",

        role: "dialog",

        "aria-modal": "true",

        "aria-labelledby": "delete-modal-title",

        onClick: (event) => {
          event.stopPropagation();
        },
      },

      h(
        "h2",
        {
          id: "delete-modal-title",
        },
        "게시글을 삭제하시겠습니까?",
      ),

      h("p", {}, "삭제한 내용은 복구할 수 없습니다."),

      h(
        "div",
        {
          className: "modal-buttons",
        },

        h(
          "button",
          {
            type: "button",

            className: "secondary-button",

            disabled: state.loading,

            onClick: () => {
              setState({
                deleteModalOpen: false,
              });
            },
          },
          "취소",
        ),

        h(
          "button",
          {
            type: "button",

            className: "danger-button",

            disabled: state.loading,

            onClick: handleDeletePost,
          },
          state.loading ? "삭제 중..." : "확인",
        ),
      ),
    ),
  );
};

const DetailView = () => {
  if (state.loading && !state.selectedPost) {
    return h(
      "main",
      {
        className: "container",
      },

      h(
        "section",
        {
          className: "card",
        },

        h("p", {}, "게시글을 불러오는 중입니다."),
      ),
    );
  }

  if (!state.selectedPost) {
    return h(
      "main",
      {
        className: "container",
      },

      h(
        "header",
        {
          className: "page-header",
        },

        h("h1", {}, "게시글 상세"),
      ),

      h(
        "section",
        {
          className: "card empty-state",
        },

        h(
          "p",
          {
            className: "message error-message",
          },
          state.message || MISSING_POST_MESSAGE,
        ),

        h(
          "button",
          {
            type: "button",

            onClick: () => {
              navigate("/posts");
            },
          },
          "목록으로",
        ),
      ),
    );
  }

  const post = state.selectedPost;

  return h(
    "main",
    {
      className: "container",
    },

    h(
      "header",
      {
        className: "page-header",
      },

      h("h1", {}, "게시글 상세"),

      h(
        "button",
        {
          type: "button",

          className: "secondary-button",

          onClick: () => {
            navigate("/posts");
          },
        },
        "목록으로",
      ),
    ),

    h(
      "section",
      {
        className: "card post-detail-card",
      },

      h("h2", {}, post.title),

      h(
        "p",
        {
          className: "post-meta",
        },
        `작성자: ${post.author}`,
      ),

      h(
        "p",
        {
          className: "post-content",
        },
        post.content,
      ),
    ),

    h(
      "section",
      {
        className: "card",
      },

      h("h2", {}, "게시글 수정"),

      h(
        "form",
        {
          onSubmit: (event) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);

            handleUpdatePost({
              title: String(formData.get("title")).trim(),

              content: String(formData.get("content")).trim(),
            });
          },
        },

        FormField({
          label: "제목",
          id: "update-title",
          name: "title",
          value: post.title,
          maxLength: 255,
        }),

        FormField({
          label: "내용",
          id: "update-content",
          name: "content",
          type: "textarea",
          value: post.content,
        }),

        h(
          "div",
          {
            className: "button-group",
          },

          h(
            "button",
            {
              type: "submit",
              disabled: state.loading,
            },
            state.loading ? "처리 중..." : "수정",
          ),

          h(
            "button",
            {
              type: "button",

              className: "danger-button",

              disabled: state.loading,

              onClick: () => {
                setState({
                  deleteModalOpen: true,
                });
              },
            },
            "삭제",
          ),
        ),
      ),

      Message(),
    ),

    DeleteModal(),
  );
};

const NotFoundView = () => {
  return h(
    "main",
    {
      className: "container",
    },

    h(
      "section",
      {
        className: "card empty-state",
      },

      h("h1", {}, "페이지를 찾을 수 없습니다."),

      h("p", {}, `요청 경로: ${state.route.path}`),

      h(
        "button",
        {
          type: "button",

          onClick: () => {
            navigate("/posts");
          },
        },
        "게시글 목록으로",
      ),
    ),
  );
};

const App = () => {
  switch (state.route.name) {
    case "auth":
      return AuthView();

    case "posts":
      return PostsView();

    case "post-create":
      return CreateView();

    case "post-detail":
      return DetailView();

    default:
      return NotFoundView();
  }
};

const renderApp = () => {
  render(App(), root);
};

async function handleLogin(data) {
  if (!data.email || !data.password) {
    setState({
      message: "이메일과 비밀번호를 입력해주세요.",

      messageType: "error",
    });

    return;
  }

  setState({
    loading: true,

    message: "로그인 요청 중입니다.",

    messageType: "",
  });

  try {
    await api.login(data);

    queueFlashMessage("로그인되었습니다.");

    navigate("/posts");
  } catch (error) {
    setState({
      loading: false,

      message: error.message,

      messageType: "error",
    });
  }
}

async function handleSignup(data) {
  if (!data.email || !data.password || !data.nickname) {
    setState({
      message: "회원가입 정보를 모두 입력해주세요.",

      messageType: "error",
    });

    return;
  }

  setState({
    loading: true,

    message: "회원가입 요청 중입니다.",

    messageType: "",
  });

  try {
    const response = await api.signup(data);

    setState({
      loading: false,

      message:
        typeof response === "string" ? response : "회원가입이 완료되었습니다.",

      messageType: "success",
    });
  } catch (error) {
    setState({
      loading: false,

      message: error.message,

      messageType: "error",
    });
  }
}

async function handleCreatePost(data) {
  if (!data.title || !data.content) {
    setState({
      message: "제목과 내용을 모두 입력해주세요.",

      messageType: "error",
    });

    return;
  }

  setState({
    loading: true,

    message: "게시글을 작성하는 중입니다.",

    messageType: "",
  });

  try {
    const createdPost = await api.createPost(data);

    queueFlashMessage("게시글이 작성되었습니다.");

    if (createdPost?.id) {
      navigate(`/posts/${createdPost.id}`);

      return;
    }

    navigate("/posts");
  } catch (error) {
    setState({
      loading: false,

      message: error.message,

      messageType: "error",
    });
  }
}

async function handleUpdatePost(data) {
  if (!data.title || !data.content) {
    setState({
      message: "제목과 내용을 모두 입력해주세요.",

      messageType: "error",
    });

    return;
  }

  setState({
    loading: true,

    message: "게시글을 수정하는 중입니다.",

    messageType: "",
  });

  try {
    const updatedPost = await api.updatePost(state.route.id, data);

    setState({
      selectedPost: updatedPost,

      loading: false,

      message: "게시글 수정이 완료되었습니다.",

      messageType: "success",
    });
  } catch (error) {
    setState({
      loading: false,

      message: error.message,

      messageType: "error",
    });
  }
}

async function handleDeletePost() {
  if (!state.route.id) {
    return;
  }

  setState({
    loading: true,

    message: "게시글을 삭제하는 중입니다.",

    messageType: "",
  });

  try {
    await api.deletePost(state.route.id);

    queueFlashMessage("게시글이 삭제되었습니다.");

    navigate("/posts", {
      replace: true,
    });
  } catch (error) {
    setState({
      loading: false,

      deleteModalOpen: false,

      message: error.message,

      messageType: "error",
    });
  }
}

function handleLogout() {
  queueFlashMessage("로그아웃되었습니다.");

  navigate("/login");
}

async function loadPosts(route) {
  try {
    const posts = await api.getPosts();

    if (state.route.path !== route.path) {
      return;
    }

    setState({
      posts,
      loading: false,
    });
  } catch (error) {
    if (state.route.path !== route.path) {
      return;
    }

    setState({
      posts: [],

      loading: false,

      message: error.message,

      messageType: "error",
    });
  }
}

async function loadPost(route) {
  try {
    const post = await api.getPost(route.id);

    if (state.route.path !== route.path) {
      return;
    }

    setState({
      selectedPost: post,

      loading: false,
    });
  } catch (error) {
    if (state.route.path !== route.path) {
      return;
    }

    console.error("게시글 상세 조회 오류:", error);

    const errorMessage =
      error.message === "백엔드 서버에 연결할 수 없습니다."
        ? error.message
        : MISSING_POST_MESSAGE;

    setState({
      selectedPost: null,

      loading: false,

      message: errorMessage,

      messageType: "error",
    });
  }
}

async function handleRouteChange(route) {
  const currentFlashMessage = flashMessage;

  flashMessage = null;

  Object.assign(state, {
    route,

    selectedPost: null,

    loading: route.name === "posts" || route.name === "post-detail",

    message: currentFlashMessage?.message ?? "",

    messageType: currentFlashMessage?.type ?? "",

    deleteModalOpen: false,
  });

  renderApp();

  if (route.name === "posts") {
    await loadPosts(route);
    return;
  }

  if (route.name === "post-detail") {
    await loadPost(route);
  }
}

startRouter(handleRouteChange);
