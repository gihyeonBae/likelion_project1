import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { getCategories } from '../../../shared/services/category-service.js';
import { getBanners } from '../../../shared/services/content-service.js';
import { getMenus } from '../../../shared/services/menu-service.js';
import { createCategoryTabs, createMenuGrid } from '../../menu/_shared/menu-renderer.js';
import { getCategoryCounts, getVisibleCategories } from '../../menu/_shared/menu-filter.js';

document.getElementById('app-header').innerHTML = renderHeader('home', '../../../..');
document.getElementById('app-footer').innerHTML = renderFooter();

const menus = await getMenus();
const allCategories = await getCategories();
const categories = getVisibleCategories(allCategories);
const categoryCounts = getCategoryCounts(menus, allCategories);
const basePath = '../../../..';
const activeBanner = getBanners()
  .filter((banner) => banner.isVisible)
  .sort((first, second) => (first.sortOrder ?? 1) - (second.sortOrder ?? 1))[0];

if (activeBanner) {
  document.getElementById('home-banner-title').textContent = activeBanner.title;
  document.getElementById('home-banner-description').textContent = activeBanner.description;
  document.getElementById('home-banner-link').textContent = activeBanner.linkLabel || '메뉴 보기';
  document.getElementById('home-banner-link').href = activeBanner.linkUrl || '/src/customer/menu/read/list';
}

document.getElementById('category-list').innerHTML = categoryCounts.map((category) => `
  <a class="category-card" href="/src/customer/menu/read/list?category=${category.id}">
    <p>${category.nameEn}</p>
    <h3>${category.nameKo}</h3>
    <span>${category.description}</span>
    <strong>${category.count}개 메뉴</strong>
  </a>
`).join('');

document.getElementById('recommended-menu').innerHTML = createMenuGrid(
  menus.filter((menu) => menu.isRecommended),
  { basePath, emptyMessage: '추천 메뉴가 없습니다.' },
);

document.getElementById('season-menu').innerHTML = createMenuGrid(
  menus.filter((menu) => menu.categoryId === 'season'),
  { basePath, emptyMessage: '시즌 메뉴가 없습니다.' },
);

const categoryNav = document.createElement('nav');
categoryNav.className = 'category-tabs category-tabs--home';
categoryNav.setAttribute('aria-label', '메뉴 카테고리');
categoryNav.innerHTML = createCategoryTabs(categories, 'all', { basePath });
document.querySelector('.page-hero__content').append(categoryNav);
