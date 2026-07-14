import { MENU_ITEMS } from '../../../data/menu.js';
import { readStorage, writeStorage } from './storage.js';
import { isSupabaseConfigured, runRequiredSupabaseQuery, runSupabaseQuery } from './supabase-client.js';

const MENU_STORAGE_KEY = 'menus';

function createMenuId() {
  return `menu-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function mapMenuRow(row) {
  return {
    id: row.id,
    nameKo: row.name_ko,
    nameEn: row.name_en,
    categoryId: row.category_id,
    description: row.description,
    price: row.price,
    imageUrl: row.image_url,
    imageTone: row.image_tone,
    tags: row.tags ?? [],
    options: row.options ?? {},
    status: row.status,
    isRecommended: row.is_recommended,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapMenuToRow(menu) {
  return {
    id: menu.id,
    name_ko: menu.nameKo,
    name_en: menu.nameEn,
    category_id: menu.categoryId,
    description: menu.description,
    price: Number(menu.price) || 0,
    image_url: menu.imageUrl || '',
    image_tone: menu.imageTone || 'coffee',
    tags: menu.tags ?? [],
    options: menu.options ?? {},
    status: menu.status || 'on-sale',
    is_recommended: Boolean(menu.isRecommended),
    created_at: menu.createdAt,
    updated_at: menu.updatedAt,
  };
}

function getLocalMenus() {
  return readStorage(MENU_STORAGE_KEY, MENU_ITEMS);
}

function saveLocalMenus(menus) {
  return writeStorage(MENU_STORAGE_KEY, menus);
}

function saveLocalMenu(menu) {
  if (!menu) {
    return null;
  }

  const menus = getLocalMenus().filter((item) => item.id !== menu.id);
  saveLocalMenus([menu, ...menus]);
  return menu;
}

export async function getMenus() {
  const localMenus = getLocalMenus();
  const rows = await runSupabaseQuery(
    (client) => client.from('menus').select('*').order('created_at', { ascending: false }),
    undefined,
    'getMenus',
  );

  if (rows !== undefined) {
    const menus = rows.map(mapMenuRow);
    saveLocalMenus(menus);
    return menus;
  }

  return localMenus;
}

export async function saveMenus(menus) {
  const rows = await runSupabaseQuery(
    (client) => client.from('menus').upsert(menus.map(mapMenuToRow)).select(),
    undefined,
    'saveMenus',
  );

  return rows !== undefined ? rows.map(mapMenuRow) : saveLocalMenus(menus);
}

export async function getMenuById(menuId) {
  const rows = await runSupabaseQuery(
    (client) => client.from('menus').select('*').eq('id', menuId).maybeSingle(),
    undefined,
    'getMenuById',
  );

  if (rows !== undefined) {
    return rows ? saveLocalMenu(mapMenuRow(rows)) : null;
  }

  return getLocalMenus().find((menu) => menu.id === menuId) || null;
}

export async function createMenu(menuData) {
  const menu = {
    id: createMenuId(),
    ...menuData,
    createdAt: new Date().toISOString(),
  };

  const rows = isSupabaseConfigured()
    ? await runRequiredSupabaseQuery(
      (client) => client.from('menus').insert(mapMenuToRow(menu)).select().single(),
      'createMenu',
    )
    : undefined;

  if (rows !== undefined) {
    return saveLocalMenu(mapMenuRow(rows));
  }

  return saveLocalMenu(menu);
}

export async function updateMenu(menuId, updates) {
  const currentMenu = await getMenuById(menuId);

  if (!currentMenu) {
    return null;
  }

  const updatedMenu = {
    ...currentMenu,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const rows = isSupabaseConfigured()
    ? await runRequiredSupabaseQuery(
      (client) => client.from('menus').update(mapMenuToRow(updatedMenu)).eq('id', menuId).select().single(),
      'updateMenu',
    )
    : undefined;

  if (rows !== undefined) {
    return saveLocalMenu(mapMenuRow(rows));
  }

  const menus = getLocalMenus().map((menu) => {
    if (menu.id !== menuId) {
      return menu;
    }

    return updatedMenu;
  });

  saveLocalMenus(menus);
  return saveLocalMenu(updatedMenu);
}

export async function deleteMenu(menuId) {
  const rows = isSupabaseConfigured()
    ? await runRequiredSupabaseQuery(
      (client) => client.from('menus').delete().eq('id', menuId),
      'deleteMenu',
    )
    : undefined;

  if (rows !== undefined) {
    return;
  }

  saveLocalMenus(getLocalMenus().filter((menu) => menu.id !== menuId));
}
