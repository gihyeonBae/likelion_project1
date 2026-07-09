import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { getCategories } from '../../../shared/services/category-service.js';
import { getMenus } from '../../../shared/services/menu-service.js';
import { createAdminCategoryRow } from '../_shared/admin-category.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const categories = getCategories().sort((first, second) => first.sortOrder - second.sortOrder);
const menus = getMenus();

document.getElementById('category-list').innerHTML = categories.length
  ? categories.map((category) => createAdminCategoryRow(
    category,
    menus.filter((menu) => menu.categoryId === category.id).length,
    { basePath },
  )).join('')
  : `
    <div class="empty-state">
      <p>등록된 카테고리가 없습니다.</p>
      <a class="button button--primary" href="../create/index.html">카테고리 등록</a>
    </div>
  `;
