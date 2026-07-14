import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { getCategories, getCategoryById, updateCategory } from '../../../shared/services/category-service.js';
import { getMenus } from '../../../shared/services/menu-service.js';
import { isRequired } from '../../../shared/utils/validation.js';
import { createAdminCategoryRow, createCategoryForm, getCategoryPayloadFromForm } from '../_shared/admin-category.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const params = new URLSearchParams(window.location.search);
const categoryId = params.get('id');
const category = categoryId ? await getCategoryById(categoryId) : null;
const container = document.getElementById('category-update');

function renderCategoryForm(categoryToEdit) {
  container.innerHTML = createCategoryForm({ category: categoryToEdit, submitLabel: '수정 저장' });

  document.getElementById('category-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = getCategoryPayloadFromForm(event.currentTarget);
    const error = document.getElementById('form-error');

    if (![payload.nameKo, payload.nameEn, payload.description].every(isRequired)) {
      error.textContent = '필수 항목을 입력해 주세요.';
      return;
    }

    try {
      const updatedCategory = await updateCategory(categoryToEdit.id, payload);

      if (!updatedCategory) {
        error.textContent = '수정할 카테고리를 찾을 수 없습니다.';
        return;
      }

      window.location.href = '/src/admin/category/read';
    } catch (updateError) {
      error.textContent = updateError.message || '카테고리 수정에 실패했습니다.';
    }
  });
}

if (!category) {
  const categories = (await getCategories()).sort((first, second) => first.sortOrder - second.sortOrder);
  const menus = await getMenus();

  container.innerHTML = `
    <section class="page-hero page-hero--menu">
      <div class="page-hero__content">
        <p class="eyebrow">Admin category</p>
        <h1>수정할 카테고리 선택</h1>
        <p class="hero__description">수정하려는 카테고리의 수정 버튼을 눌러 주세요.</p>
        <div class="hero__actions">
          <a class="button button--primary" href="/src/admin/category/create">카테고리 등록</a>
          <a class="button button--ghost" href="/src/admin/category/read">목록</a>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="cart-list">
        ${categories.length
          ? categories.map((item) => createAdminCategoryRow(
            item,
            menus.filter((menu) => menu.categoryId === item.id).length,
            { basePath },
          )).join('')
          : `
            <div class="empty-state">
              <p>등록된 카테고리가 없습니다.</p>
              <a class="button button--primary" href="/src/admin/category/create">카테고리 등록</a>
            </div>
          `}
      </div>
    </section>
  `;
  container.addEventListener('click', async (event) => {
    const updateLink = event.target.closest('a[href*="/src/admin/category/update"]');

    if (!updateLink) {
      return;
    }

    event.preventDefault();
    const selectedCategoryId = new URL(updateLink.href).searchParams.get('id');
    const selectedCategory = selectedCategoryId ? await getCategoryById(selectedCategoryId) : null;

    if (!selectedCategory) {
      container.querySelector('.hero__description').textContent = '선택한 카테고리를 찾을 수 없습니다. 목록을 새로고침해 주세요.';
      return;
    }

    window.history.pushState(null, '', `/src/admin/category/update?id=${selectedCategory.id}`);
    renderCategoryForm(selectedCategory);
  });
} else {
  renderCategoryForm(category);
}
