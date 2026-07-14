import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { getCategories } from '../../../shared/services/category-service.js';
import { getMenuById, getMenus, updateMenu } from '../../../shared/services/menu-service.js';
import { isRequired } from '../../../shared/utils/validation.js';
import { createAdminMenuRow, createMenuForm, getMenuPayloadFromForm } from '../_shared/admin-menu.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const params = new URLSearchParams(window.location.search);
const menuId = params.get('id');
const menu = menuId ? await getMenuById(menuId) : null;
const categories = await getCategories();
const container = document.getElementById('menu-update');

function renderMenuForm(menuToEdit) {
  container.innerHTML = createMenuForm({ menu: menuToEdit, categories, submitLabel: '수정 저장' });

  document.getElementById('menu-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = getMenuPayloadFromForm(event.currentTarget);
    const error = document.getElementById('form-error');

    if (![payload.nameKo, payload.nameEn, payload.categoryId, payload.description].every(isRequired) || payload.price < 0) {
      error.textContent = '필수 항목과 가격을 확인해 주세요.';
      return;
    }

    try {
      const updatedMenu = await updateMenu(menuToEdit.id, payload);

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

if (!menu) {
  const menus = await getMenus();

  container.innerHTML = `
    <section class="page-hero page-hero--menu">
      <div class="page-hero__content">
        <p class="eyebrow">Admin menu</p>
        <h1>수정할 메뉴 선택</h1>
        <p class="hero__description">수정하려는 메뉴의 수정 버튼을 눌러 주세요.</p>
        <div class="hero__actions">
          <a class="button button--primary" href="/src/admin/menu/create/index.html">메뉴 등록</a>
          <a class="button button--ghost" href="/src/admin/menu/read/list/index.html">목록</a>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="cart-list">
        ${menus.length
          ? menus.map((item) => createAdminMenuRow(item, categories, { basePath })).join('')
          : `
            <div class="empty-state">
              <p>등록된 메뉴가 없습니다.</p>
              <a class="button button--primary" href="/src/admin/menu/create/index.html">메뉴 등록</a>
            </div>
          `}
      </div>
    </section>
  `;
  container.addEventListener('click', async (event) => {
    const updateLink = event.target.closest('a[href*="/src/admin/menu/update"]');

    if (!updateLink) {
      return;
    }

    event.preventDefault();
    const selectedMenuId = new URL(updateLink.href).searchParams.get('id');
    const selectedMenu = selectedMenuId ? await getMenuById(selectedMenuId) : null;

    if (!selectedMenu) {
      container.querySelector('.hero__description').textContent = '선택한 메뉴를 찾을 수 없습니다. 목록을 새로고침해 주세요.';
      return;
    }

    window.history.pushState(null, '', `/src/admin/menu/update/index.html?id=${selectedMenu.id}`);
    renderMenuForm(selectedMenu);
  });
} else {
  renderMenuForm(menu);
}
