const normalizePath = (path) => {
  if (path.startsWith("/")) {
    return path;
  }

  return `/${path}`;
};

export const getCurrentRoute = () => {
  const path = decodeURIComponent(window.location.hash.slice(1) || "/login");

  if (path === "/" || path === "/login") {
    return {
      name: "auth",
      path: "/login",
    };
  }

  if (path === "/posts") {
    return {
      name: "posts",
      path,
    };
  }

  if (path === "/posts/new") {
    return {
      name: "post-create",
      path,
    };
  }

  const detailMatch = path.match(/^\/posts\/(\d+)$/);

  if (detailMatch) {
    return {
      name: "post-detail",
      path,
      id: detailMatch[1],
    };
  }

  return {
    name: "not-found",
    path,
  };
};

export const navigate = (path, options = {}) => {
  const normalizedPath = normalizePath(path);
  const nextHash = `#${normalizedPath}`;

  if (options.replace) {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}${nextHash}`,
    );

    window.dispatchEvent(new HashChangeEvent("hashchange"));

    return;
  }

  if (window.location.hash === nextHash) {
    window.dispatchEvent(new HashChangeEvent("hashchange"));

    return;
  }

  window.location.hash = normalizedPath;
};

export const startRouter = (onRouteChange) => {
  const notify = () => {
    onRouteChange(getCurrentRoute());
  };

  window.addEventListener("hashchange", notify);

  if (!window.location.hash) {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#/login`,
    );
  }

  notify();
};
