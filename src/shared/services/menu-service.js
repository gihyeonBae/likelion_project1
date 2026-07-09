import { MENU_ITEMS } from '../../../data/menu.js';
import { readStorage, writeStorage } from './storage.js';

const MENU_STORAGE_KEY = 'menus';

function createMenuId() {
  return `menu-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getMenus() {
  return readStorage(MENU_STORAGE_KEY, MENU_ITEMS);
}

export function saveMenus(menus) {
  return writeStorage(MENU_STORAGE_KEY, menus);
}

export function getMenuById(menuId) {
  return getMenus().find((menu) => menu.id === menuId) || null;
}

export function createMenu(menuData) {
  const menu = {
    id: createMenuId(),
    ...menuData,
    createdAt: new Date().toISOString(),
  };

  saveMenus([menu, ...getMenus()]);
  return menu;
}

export function updateMenu(menuId, updates) {
  const menus = getMenus().map((menu) => {
    if (menu.id !== menuId) {
      return menu;
    }

    return {
      ...menu,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  });

  saveMenus(menus);
  return getMenuById(menuId);
}

export function deleteMenu(menuId) {
  saveMenus(getMenus().filter((menu) => menu.id !== menuId));
}
