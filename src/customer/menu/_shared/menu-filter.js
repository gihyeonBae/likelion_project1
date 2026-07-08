export function getVisibleCategories(categories) {
  return categories
    .filter((category) => category.isVisible)
    .sort((first, second) => first.sortOrder - second.sortOrder);
}

export function getCategoryById(categories, categoryId) {
  return categories.find((category) => category.id === categoryId) || null;
}

export function getMenuCategoryLabel(categories, menu) {
  return getCategoryById(categories, menu.categoryId)?.nameKo ?? '기타';
}

export function getCategoryCounts(menus, categories) {
  return getVisibleCategories(categories).map((category) => ({
    ...category,
    count: menus.filter((menu) => menu.categoryId === category.id).length,
  }));
}

export function filterMenus(menus, { categoryId = 'all', keyword = '', status = 'all' } = {}) {
  const normalizedKeyword = keyword.trim().toLowerCase();

  return menus.filter((menu) => {
    const matchesCategory = categoryId === 'all' || menu.categoryId === categoryId;
    const matchesStatus = status === 'all' || menu.status === status;
    const matchesKeyword = !normalizedKeyword
      || menu.nameKo.toLowerCase().includes(normalizedKeyword)
      || menu.nameEn.toLowerCase().includes(normalizedKeyword)
      || menu.description.toLowerCase().includes(normalizedKeyword)
      || menu.tags.some((tag) => tag.toLowerCase().includes(normalizedKeyword));

    return matchesCategory && matchesStatus && matchesKeyword;
  });
}

export function sortMenus(menus, sortKey = 'recommended') {
  return [...menus].sort((first, second) => {
    if (sortKey === 'price-low') {
      return first.price - second.price;
    }

    if (sortKey === 'price-high') {
      return second.price - first.price;
    }

    if (sortKey === 'name') {
      return first.nameKo.localeCompare(second.nameKo, 'ko');
    }

    return Number(second.isRecommended) - Number(first.isRecommended);
  });
}
