import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { getCategories } from '../../../shared/services/category-service.js';
import { getMenuById, updateMenu } from '../../../shared/services/menu-service.js';
import { isRequired } from '../../../shared/utils/validation.js';
import { createMenuForm, getMenuPayloadFromForm } from '../_shared/admin-menu.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const menu = await getMenuById(new URLSearchParams(window.location.search).get('id'));
const categories = await getCategories();
const container = document.getElementById('menu-update');

if (!menu) {
  container.innerHTML = `
    <div class="empty-state">
      <p>수정할 메뉴를 찾을 수 없습니다.</p>
      <a class="button button--primary" href="/src/admin/menu/read/list/index.html">목록</a>
    </div>
  `;
} else {
  container.innerHTML = createMenuForm({ menu, categories, submitLabel: '수정 저장' });

  document.getElementById('menu-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = getMenuPayloadFromForm(event.currentTarget);
    const error = document.getElementById('form-error');

    if (![payload.nameKo, payload.nameEn, payload.categoryId, payload.description].every(isRequired) || payload.price < 0) {
      error.textContent = '필수 항목과 가격을 확인해 주세요.';
      return;
    }

    try {
      const updatedMenu = await updateMenu(menu.id, payload);

      if (!updatedMenu) {
        error.textContent = '수정할 메뉴를 찾을 수 없습니다.';
        return;
      }

      window.location.href = `/src/admin/menu/read/detail/index.html?id=${updatedMenu.id}`;
    } catch (updateError) {
      error.textContent = updateError.message || '메뉴 수정에 실패했습니다.';
    }
  });
}
