import { readStorage, writeStorage } from './storage.js';

const CART_STORAGE_KEY = 'cart-items';

function createCartItemId() {
  return `cart-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeQuantity(quantity) {
  const nextQuantity = Number.parseInt(quantity, 10);
  return Number.isNaN(nextQuantity) || nextQuantity < 1 ? 1 : nextQuantity;
}

export function createCartMenuSnapshot(menu) {
  if (!menu) {
    return null;
  }

  return {
    id: menu.id,
    nameKo: menu.nameKo,
    nameEn: menu.nameEn,
    categoryId: menu.categoryId,
    description: menu.description,
    price: Number(menu.price) || 0,
    imageUrl: menu.imageUrl || '',
    imageTone: menu.imageTone || 'coffee',
    options: menu.options ?? {},
    status: menu.status || 'on-sale',
  };
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

export function addCartItem({ menuId, quantity = 1, options = {}, menuSnapshot = null }) {
  const cartItem = {
    id: createCartItemId(),
    menuId,
    quantity: normalizeQuantity(quantity),
    options,
    menuSnapshot,
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
