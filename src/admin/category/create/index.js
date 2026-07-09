import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { createCategory } from '../../../shared/services/category-service.js';
import { isRequired } from '../../../shared/utils/validation.js';
import { createCategoryForm, getCategoryPayloadFromForm } from '../_shared/admin-category.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();
document.getElementById('category-create').innerHTML = createCategoryForm({ submitLabel: '카테고리 등록' });

document.getElementById('category-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const payload = getCategoryPayloadFromForm(event.currentTarget);
  const error = document.getElementById('form-error');

  if (![payload.id, payload.nameKo, payload.nameEn, payload.description].every(isRequired)) {
    error.textContent = '필수 항목을 입력해 주세요.';
    return;
  }

  try {
    createCategory(payload);
    window.location.href = '../read/index.html';
  } catch (createError) {
    error.textContent = createError.message;
  }
});
