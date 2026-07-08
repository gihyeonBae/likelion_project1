import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getMenus } from '../../../../shared/services/menu-service.js';
import { CATEGORIES } from '../../../../../data/categories.js';
import { createCategoryTabs, createMenuGrid } from '../../_shared/menu-renderer.js';
import { filterMenus, getCategoryById, getVisibleCategories, sortMenus } from '../../_shared/menu-filter.js';

document.getElementById('app-header').innerHTML = renderHeader('menu', '../../../../..');
document.getElementById('app-footer').innerHTML = renderFooter();

const basePath = '../../../../..';
const params = new URLSearchParams(window.location.search);
const activeCategoryId = params.get('category') || 'all';
const activeSort = params.get('sort') || 'recommended';
const menus = getMenus();
const categories = getVisibleCategories(CATEGORIES);
const sortSelect = document.getElementById('sort-select');

sortSelect.value = activeSort;
document.getElementById('category-tabs').innerHTML = createCategoryTabs(categories, activeCategoryId, { basePath });

function renderMenus() {
  const sortedMenus = sortMenus(
    filterMenus(menus, { categoryId: activeCategoryId }),
    sortSelect.value,
  );
  const category = getCategoryById(CATEGORIES, activeCategoryId);
  const label = category ? category.nameKo : '전체';

  document.getElementById('result-summary').textContent = `${label} 메뉴 ${sortedMenus.length}개`;
  document.getElementById('menu-list').innerHTML = createMenuGrid(sortedMenus, { basePath });
}

sortSelect.addEventListener('change', () => {
  const nextParams = new URLSearchParams(window.location.search);
  nextParams.set('sort', sortSelect.value);
  nextParams.set('category', activeCategoryId);
  window.history.replaceState(null, '', `?${nextParams.toString()}`);
  renderMenus();
});

renderMenus();
