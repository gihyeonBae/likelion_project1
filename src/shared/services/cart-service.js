import { readStorage, writeStorage } from './storage.js';

const CART_STORAGE_KEY = 'cart-items';

export function getCartItems() {
  return readStorage(CART_STORAGE_KEY, []);
}

export function saveCartItems(cartItems) {
  return writeStorage(CART_STORAGE_KEY, cartItems);
}
