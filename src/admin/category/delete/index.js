import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { deleteCategory, getCategoryById } from '../../../shared/services/category-service.js';
import { getMenus } from '../../../shared/services/menu-service.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const category = await getCategoryById(new URLSearchParams(window.location.search).get('id'));
const menus = (await getMenus()).filter((menu) => menu.categoryId === category?.id);
const container = document.getElementById('category-delete');

container.innerHTML = category
  ? `
    <section class="confirm-panel">
      <p class="eyebrow">Delete category</p>
      <h1>${category.nameKo} 삭제</h1>
      <p class="hero__description">
        ${menus.length ? `이 카테고리에 메뉴 ${menus.length}개가 있어 삭제할 수 없습니다.` : '고객 메뉴판에서도 이 카테고리가 사라집니다.'}
      </p>
      <div class="detail-actions">
        <button class="button button--primary${menus.length ? ' is-disabled' : ''}" id="delete-category" type="button"${menus.length ? ' disabled' : ''}>삭제</button>
        <a class="button button--ghost" href="/src/admin/category/read/index.html">목록</a>
      </div>
    </section>
  `
  : `
    <div class="empty-state">
      <p>삭제할 카테고리를 찾을 수 없습니다.</p>
      <a class="button button--primary" href="/src/admin/category/read/index.html">목록</a>
    </div>
  `;

document.getElementById('delete-category')?.addEventListener('click', async () => {
  await deleteCategory(category.id);
  window.location.href = '/src/admin/category/read/index.html';
});
