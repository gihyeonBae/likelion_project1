import { CATEGORIES } from '../../../data/categories.js';
import { readStorage, writeStorage } from './storage.js';

const CATEGORY_STORAGE_KEY = 'categories';

function normalizeCategoryId(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getCategories() {
  return readStorage(CATEGORY_STORAGE_KEY, CATEGORIES);
}

export function saveCategories(categories) {
  return writeStorage(CATEGORY_STORAGE_KEY, categories);
}

export function getCategoryById(categoryId) {
  return getCategories().find((category) => category.id === categoryId) || null;
}

export function createCategory(categoryData) {
  const id = normalizeCategoryId(categoryData.id || categoryData.nameEn || categoryData.nameKo);

  if (!id) {
    throw new Error('카테고리 ID를 입력해 주세요.');
  }

  if (getCategoryById(id)) {
    throw new Error('이미 존재하는 카테고리 ID입니다.');
  }

  const category = {
    id,
    nameKo: categoryData.nameKo,
    nameEn: categoryData.nameEn,
    description: categoryData.description,
    sortOrder: Number(categoryData.sortOrder) || getCategories().length + 1,
    isVisible: Boolean(categoryData.isVisible),
    createdAt: new Date().toISOString(),
  };

  saveCategories([...getCategories(), category]);
  return category;
}

export function updateCategory(categoryId, updates) {
  const categories = getCategories().map((category) => {
    if (category.id !== categoryId) {
      return category;
    }

    return {
      ...category,
      ...updates,
      sortOrder: Number(updates.sortOrder) || category.sortOrder,
      isVisible: Boolean(updates.isVisible),
      updatedAt: new Date().toISOString(),
    };
  });

  saveCategories(categories);
  return getCategoryById(categoryId);
}

export function deleteCategory(categoryId) {
  saveCategories(getCategories().filter((category) => category.id !== categoryId));
}
