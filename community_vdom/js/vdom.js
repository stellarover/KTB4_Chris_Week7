const TEXT_ELEMENT = "TEXT_ELEMENT";

const createTextVNode = (value) => {
  return {
    type: TEXT_ELEMENT,

    props: {
      nodeValue: String(value),
    },

    children: [],
  };
};

export const h = (type, props = {}, ...children) => {
  const normalizedChildren = children
    .flat(Infinity)
    .filter((child) => child !== null && child !== undefined && child !== false)
    .map((child) => {
      if (typeof child === "object") {
        return child;
      }

      return createTextVNode(child);
    });

  return {
    type,
    props: props ?? {},
    children: normalizedChildren,
  };
};

const isEventProperty = (name) => {
  return name.startsWith("on");
};

const setProperty = (element, name, oldValue, newValue) => {
  if (name === "key") {
    return;
  }

  if (isEventProperty(name)) {
    const eventName = name.slice(2).toLowerCase();

    if (oldValue) {
      element.removeEventListener(eventName, oldValue);
    }

    if (newValue) {
      element.addEventListener(eventName, newValue);
    }

    return;
  }

  if (name === "className") {
    element.className = newValue ?? "";
    return;
  }

  if (name === "htmlFor") {
    if (newValue == null) {
      element.removeAttribute("for");
    } else {
      element.setAttribute("for", newValue);
    }

    return;
  }

  if (name === "style") {
    const oldStyle = oldValue ?? {};
    const newStyle = newValue ?? {};

    Object.keys(oldStyle).forEach((styleName) => {
      if (!(styleName in newStyle)) {
        element.style[styleName] = "";
      }
    });

    Object.assign(element.style, newStyle);

    return;
  }

  if (newValue === null || newValue === undefined || newValue === false) {
    element.removeAttribute(name);

    if (name in element && typeof element[name] === "boolean") {
      element[name] = false;
    }

    return;
  }

  if (name in element && name !== "list" && name !== "form") {
    try {
      element[name] = newValue;
      return;
    } catch {}
  }

  if (newValue === true) {
    element.setAttribute(name, "");
    return;
  }

  element.setAttribute(name, newValue);
};

const updateProperties = (element, oldProps = {}, newProps = {}) => {
  const propertyNames = new Set([
    ...Object.keys(oldProps),
    ...Object.keys(newProps),
  ]);

  propertyNames.forEach((name) => {
    const oldValue = oldProps[name];
    const newValue = newProps[name];

    if (oldValue !== newValue) {
      setProperty(element, name, oldValue, newValue);
    }
  });
};

export const createElement = (vnode) => {
  if (vnode.type === TEXT_ELEMENT) {
    return document.createTextNode(vnode.props.nodeValue);
  }

  const element = document.createElement(vnode.type);

  updateProperties(element, {}, vnode.props);

  vnode.children.forEach((child) => {
    element.appendChild(createElement(child));
  });

  return element;
};

const isDifferentNode = (newVNode, oldVNode) => {
  return newVNode.type !== oldVNode.type;
};

export const patch = (parent, newVNode, oldVNode, index = 0) => {
  const currentElement = parent.childNodes[index];

  if (!oldVNode && newVNode) {
    console.log("[VDOM patch] 노드 추가:", newVNode.type);

    parent.insertBefore(createElement(newVNode), currentElement ?? null);

    return;
  }

  if (oldVNode && !newVNode) {
    console.log("[VDOM patch] 노드 제거:", oldVNode.type);

    if (currentElement) {
      parent.removeChild(currentElement);
    }

    return;
  }

  if (newVNode && oldVNode && isDifferentNode(newVNode, oldVNode)) {
    console.log("[VDOM patch] 노드 교체:", oldVNode.type, "→", newVNode.type);

    parent.replaceChild(createElement(newVNode), currentElement);

    return;
  }

  if (newVNode.type === TEXT_ELEMENT) {
    const newText = newVNode.props.nodeValue;

    const oldText = oldVNode.props.nodeValue;

    if (newText !== oldText) {
      console.log("[VDOM patch] 텍스트 변경:", oldText, "→", newText);

      currentElement.nodeValue = newText;
    }

    return;
  }

  updateProperties(currentElement, oldVNode.props, newVNode.props);

  const oldChildren = oldVNode.children;

  const newChildren = newVNode.children;

  const commonLength = Math.min(oldChildren.length, newChildren.length);

  for (let childIndex = 0; childIndex < commonLength; childIndex += 1) {
    patch(
      currentElement,
      newChildren[childIndex],
      oldChildren[childIndex],
      childIndex,
    );
  }

  for (
    let childIndex = oldChildren.length - 1;
    childIndex >= newChildren.length;
    childIndex -= 1
  ) {
    patch(currentElement, null, oldChildren[childIndex], childIndex);
  }

  for (
    let childIndex = commonLength;
    childIndex < newChildren.length;
    childIndex += 1
  ) {
    patch(currentElement, newChildren[childIndex], null, childIndex);
  }
};

const previousTrees = new WeakMap();

export const render = (vnode, container) => {
  const oldVNode = previousTrees.get(container);

  patch(container, vnode, oldVNode, 0);

  previousTrees.set(container, vnode);
};
