import { createMenuCard } from '../../../shared/components/menu-card.js';

export function createMenuGrid(menus, { basePath, emptyMessage = '조건에 맞는 메뉴가 없습니다.' }) {
  if (!menus.length) {
    return `<p class="empty-state">${emptyMessage}</p>`;
  }

  return menus.map((menu) => createMenuCard(menu, {
    basePath,
    detailHref: `/src/customer/menu/read/detail?id=${encodeURIComponent(menu.id)}`,
  })).join('');
}

export function createCategoryTabs(categories, activeCategoryId, { basePath, includeAll = true } = {}) {
  const allTab = includeAll
    ? `<a class="category-tab${activeCategoryId === 'all' ? ' is-active' : ''}" href="/src/customer/menu/read/list?category=all">전체</a>`
    : '';

  const categoryTabs = categories.map((category) => `
    <a class="category-tab${activeCategoryId === category.id ? ' is-active' : ''}" href="/src/customer/menu/read/list?category=${category.id}">
      ${category.nameKo}
    </a>
  `).join('');

  return `${allTab}${categoryTabs}`;
}
