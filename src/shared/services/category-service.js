import { CATEGORIES } from '../../../data/categories.js';
import { readStorage, writeStorage } from './storage.js';
import { isSupabaseConfigured, runRequiredSupabaseQuery, runSupabaseQuery } from './supabase-client.js';

const CATEGORY_STORAGE_KEY = 'categories';

function normalizeCategoryId(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function mapCategoryRow(row) {
  return {
    id: row.id,
    nameKo: row.name_ko,
    nameEn: row.name_en,
    description: row.description,
    sortOrder: row.sort_order,
    isVisible: row.is_visible,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapCategoryToRow(category) {
  return {
    id: category.id,
    name_ko: category.nameKo,
    name_en: category.nameEn,
    description: category.description,
    sort_order: Number(category.sortOrder) || 1,
    is_visible: Boolean(category.isVisible),
    created_at: category.createdAt,
    updated_at: category.updatedAt,
  };
}

function getLocalCategories() {
  return readStorage(CATEGORY_STORAGE_KEY, CATEGORIES);
}

function saveLocalCategories(categories) {
  return writeStorage(CATEGORY_STORAGE_KEY, categories);
}

function saveLocalCategory(category) {
  if (!category) {
    return null;
  }

  const categories = getLocalCategories().filter((item) => item.id !== category.id);
  saveLocalCategories([...categories, category].sort((first, second) => first.sortOrder - second.sortOrder));
  return category;
}

export async function getCategories() {
  const localCategories = getLocalCategories();
  const rows = await runSupabaseQuery(
    (client) => client.from('categories').select('*').order('sort_order', { ascending: true }),
    undefined,
    'getCategories',
  );

  if (rows !== undefined) {
    const categories = rows.map(mapCategoryRow);
    saveLocalCategories(categories);
    return categories;
  }

  return localCategories;
}

export async function saveCategories(categories) {
  const rows = await runSupabaseQuery(
    (client) => client.from('categories').upsert(categories.map(mapCategoryToRow)).select(),
    undefined,
    'saveCategories',
  );

  return rows !== undefined ? rows.map(mapCategoryRow) : saveLocalCategories(categories);
}

export async function getCategoryById(categoryId) {
  const row = await runSupabaseQuery(
    (client) => client.from('categories').select('*').eq('id', categoryId).maybeSingle(),
    undefined,
    'getCategoryById',
  );

  if (row !== undefined) {
    return row ? saveLocalCategory(mapCategoryRow(row)) : null;
  }

  return getLocalCategories().find((category) => category.id === categoryId) || null;
}

export async function createCategory(categoryData) {
  const id = normalizeCategoryId(categoryData.id || categoryData.nameEn || categoryData.nameKo);

  if (!id) {
    throw new Error('카테고리 ID를 입력해 주세요.');
  }

  if (await getCategoryById(id)) {
    throw new Error('이미 존재하는 카테고리 ID입니다.');
  }

  const category = {
    id,
    nameKo: categoryData.nameKo,
    nameEn: categoryData.nameEn,
    description: categoryData.description,
    sortOrder: Number(categoryData.sortOrder) || getLocalCategories().length + 1,
    isVisible: Boolean(categoryData.isVisible),
    createdAt: new Date().toISOString(),
  };

  const row = isSupabaseConfigured()
    ? await runRequiredSupabaseQuery(
      (client) => client.from('categories').insert(mapCategoryToRow(category)).select().single(),
      'createCategory',
    )
    : undefined;

  if (row !== undefined) {
    return saveLocalCategory(mapCategoryRow(row));
  }

  return saveLocalCategory(category);
}

export async function updateCategory(categoryId, updates) {
  const currentCategory = await getCategoryById(categoryId);

  if (!currentCategory) {
    return null;
  }

  const updatedCategory = {
    ...currentCategory,
    ...updates,
    sortOrder: Number(updates.sortOrder) || currentCategory.sortOrder,
    isVisible: Boolean(updates.isVisible),
    updatedAt: new Date().toISOString(),
  };

  const row = isSupabaseConfigured()
    ? await runRequiredSupabaseQuery(
      (client) => client.from('categories').update(mapCategoryToRow(updatedCategory)).eq('id', categoryId).select().single(),
      'updateCategory',
    )
    : undefined;

  if (row !== undefined) {
    return saveLocalCategory(mapCategoryRow(row));
  }

  const categories = getLocalCategories().map((category) => {
    if (category.id !== categoryId) {
      return category;
    }

    return updatedCategory;
  });

  saveLocalCategories(categories);
  return saveLocalCategory(updatedCategory);
}

export async function deleteCategory(categoryId) {
  const row = isSupabaseConfigured()
    ? await runRequiredSupabaseQuery(
      (client) => client.from('categories').delete().eq('id', categoryId),
      'deleteCategory',
    )
    : undefined;

  if (row !== undefined) {
    return;
  }

  saveLocalCategories(getLocalCategories().filter((category) => category.id !== categoryId));
}
