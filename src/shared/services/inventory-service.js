import { INVENTORY_ITEMS } from '../../../data/inventory.js';
import { readStorage, writeStorage } from './storage.js';

const INVENTORY_STORAGE_KEY = 'inventory-items';

function createInventoryId() {
  return `inventory-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getInventoryItems() {
  return readStorage(INVENTORY_STORAGE_KEY, INVENTORY_ITEMS);
}

export function saveInventoryItems(items) {
  return writeStorage(INVENTORY_STORAGE_KEY, items);
}

export function getInventoryItemById(itemId) {
  return getInventoryItems().find((item) => item.id === itemId) || null;
}

export function createInventoryItem(itemData) {
  const item = {
    id: createInventoryId(),
    name: itemData.name,
    category: itemData.category,
    unit: itemData.unit,
    quantity: Number(itemData.quantity) || 0,
    safetyQuantity: Number(itemData.safetyQuantity) || 0,
    status: itemData.status || 'available',
    histories: itemData.initialHistory ? [itemData.initialHistory] : [],
    createdAt: new Date().toISOString(),
  };

  saveInventoryItems([item, ...getInventoryItems()]);
  return item;
}

export function updateInventoryItem(itemId, updates) {
  const items = getInventoryItems().map((item) => {
    if (item.id !== itemId) {
      return item;
    }

    return {
      ...item,
      ...updates,
      quantity: Number(updates.quantity ?? item.quantity) || 0,
      safetyQuantity: Number(updates.safetyQuantity ?? item.safetyQuantity) || 0,
      updatedAt: new Date().toISOString(),
    };
  });

  saveInventoryItems(items);
  return getInventoryItemById(itemId);
}

export function addInventoryHistory(itemId, history) {
  const item = getInventoryItemById(itemId);

  if (!item) {
    return null;
  }

  return updateInventoryItem(itemId, {
    quantity: item.quantity + Number(history.quantityChange || 0),
    histories: [
      {
        id: `history-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        ...history,
        createdAt: new Date().toISOString(),
      },
      ...(item.histories ?? []),
    ],
  });
}

export function deleteInventoryItem(itemId) {
  saveInventoryItems(getInventoryItems().filter((item) => item.id !== itemId));
}
