import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { getCategories } from '../../../shared/services/category-service.js';
import { createMenu } from '../../../shared/services/menu-service.js';
import { isRequired } from '../../../shared/utils/validation.js';
import { createMenuForm, getMenuPayloadFromForm } from '../_shared/admin-menu.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const categories = await getCategories();
const container = document.getElementById('menu-create');

if (!categories.length) {
  container.innerHTML = `
    <div class="empty-state">
      <p>메뉴를 등록하려면 카테고리가 필요합니다.</p>
      <a class="button button--primary" href="../../category/create/index.html">카테고리 등록</a>
    </div>
  `;
} else {
  container.innerHTML = createMenuForm({ categories, submitLabel: '메뉴 등록' });

  document.getElementById('menu-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = getMenuPayloadFromForm(event.currentTarget);
    const error = document.getElementById('form-error');

    if (![payload.nameKo, payload.nameEn, payload.categoryId, payload.description].every(isRequired) || payload.price < 0) {
      error.textContent = '필수 항목과 가격을 확인해 주세요.';
      return;
    }

    const menu = await createMenu(payload);
    window.location.href = `../read/detail/index.html?id=${menu.id}`;
  });
}
