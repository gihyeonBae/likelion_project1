import { readStorage, writeStorage } from './storage.js';

const CART_STORAGE_KEY = 'cart-items';

function createCartItemId() {
  return `cart-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeQuantity(quantity) {
  const nextQuantity = Number.parseInt(quantity, 10);
  return Number.isNaN(nextQuantity) || nextQuantity < 1 ? 1 : nextQuantity;
}

export function getCartItems() {
  return readStorage(CART_STORAGE_KEY, []);
}

export function saveCartItems(cartItems) {
  return writeStorage(CART_STORAGE_KEY, cartItems);
}

export function getCartItemById(cartItemId) {
  return getCartItems().find((item) => item.id === cartItemId) || null;
}

export function addCartItem({ menuId, quantity = 1, options = {} }) {
  const cartItem = {
    id: createCartItemId(),
    menuId,
    quantity: normalizeQuantity(quantity),
    options,
    selected: true,
    createdAt: new Date().toISOString(),
  };

  saveCartItems([...getCartItems(), cartItem]);
  return cartItem;
}

export function updateCartItem(cartItemId, updates) {
  const cartItems = getCartItems().map((item) => {
    if (item.id !== cartItemId) {
      return item;
    }

    return {
      ...item,
      ...updates,
      quantity: normalizeQuantity(updates.quantity ?? item.quantity),
      options: {
        ...item.options,
        ...(updates.options ?? {}),
      },
      updatedAt: new Date().toISOString(),
    };
  });

  saveCartItems(cartItems);
  return getCartItemById(cartItemId);
}

export function removeCartItem(cartItemId) {
  saveCartItems(getCartItems().filter((item) => item.id !== cartItemId));
}

export function clearCartItems() {
  saveCartItems([]);
}
