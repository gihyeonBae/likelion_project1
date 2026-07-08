import { readStorage, writeStorage } from './storage.js';

const ORDER_STORAGE_KEY = 'orders';

export function getOrders() {
  return readStorage(ORDER_STORAGE_KEY, []);
}

export function saveOrders(orders) {
  return writeStorage(ORDER_STORAGE_KEY, orders);
}
