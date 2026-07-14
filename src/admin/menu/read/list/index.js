import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getCategories } from '../../../../shared/services/category-service.js';
import { getMenus } from '../../../../shared/services/menu-service.js';
import { createAdminMenuRow } from '../../_shared/admin-menu.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const menus = await getMenus();
const categories = await getCategories();
const categoryFilter = document.getElementById('category-filter');
const statusFilter = document.getElementById('status-filter');

categoryFilter.innerHTML = `
  <option value="all">전체</option>
  ${categories.map((category) => `<option value="${category.id}">${category.nameKo}</option>`).join('')}
`;

function renderMenus() {
  const filteredMenus = menus.filter((menu) => {
    const matchesCategory = categoryFilter.value === 'all' || menu.categoryId === categoryFilter.value;
    const matchesStatus = statusFilter.value === 'all' || menu.status === statusFilter.value;
    return matchesCategory && matchesStatus;
  });

  document.getElementById('menu-summary').textContent = `관리 메뉴 ${filteredMenus.length}개`;
  document.getElementById('admin-menu-list').innerHTML = filteredMenus.length
    ? filteredMenus.map((menu) => createAdminMenuRow(menu, categories, { basePath })).join('')
    : `
      <div class="empty-state">
        <p>조건에 맞는 메뉴가 없습니다.</p>
        <a class="button button--primary" href="/src/admin/menu/create">메뉴 등록</a>
      </div>
    `;
}

categoryFilter.addEventListener('change', renderMenus);
statusFilter.addEventListener('change', renderMenus);
renderMenus();
