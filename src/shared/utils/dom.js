export function getRequiredElement(selector, root = document) {
  const element = root.querySelector(selector);

  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }

  return element;
}

export function setText(selector, value, root = document) {
  getRequiredElement(selector, root).textContent = value;
}
