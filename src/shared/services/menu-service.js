import { MENU_ITEMS } from '../../../data/menu.js';
import { readStorage, writeStorage } from './storage.js';

const MENU_STORAGE_KEY = 'menus';

export function getMenus() {
  return readStorage(MENU_STORAGE_KEY, MENU_ITEMS);
}

export function saveMenus(menus) {
  return writeStorage(MENU_STORAGE_KEY, menus);
}

export function getMenuById(menuId) {
  return getMenus().find((menu) => menu.id === menuId) || null;
}
