import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { getCategoryById, updateCategory } from '../../../shared/services/category-service.js';
import { isRequired } from '../../../shared/utils/validation.js';
import { createCategoryForm, getCategoryPayloadFromForm } from '../_shared/admin-category.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const category = await getCategoryById(new URLSearchParams(window.location.search).get('id'));
const container = document.getElementById('category-update');

if (!category) {
  container.innerHTML = `
    <div class="empty-state">
      <p>수정할 카테고리를 찾을 수 없습니다.</p>
      <a class="button button--primary" href="/src/admin/category/read/index.html">목록</a>
    </div>
  `;
} else {
  container.innerHTML = createCategoryForm({ category, submitLabel: '수정 저장' });

  document.getElementById('category-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = getCategoryPayloadFromForm(event.currentTarget);
    const error = document.getElementById('form-error');

    if (![payload.nameKo, payload.nameEn, payload.description].every(isRequired)) {
      error.textContent = '필수 항목을 입력해 주세요.';
      return;
    }

    await updateCategory(category.id, payload);
    window.location.href = '/src/admin/category/read/index.html';
  });
}
