import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { deleteMenu, getMenuById } from '../../../shared/services/menu-service.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const menu = await getMenuById(new URLSearchParams(window.location.search).get('id'));
const container = document.getElementById('menu-delete');

container.innerHTML = menu
  ? `
    <section class="confirm-panel">
      <p class="eyebrow">Delete menu</p>
      <h1>${menu.nameKo} 삭제</h1>
      <p class="hero__description">고객 화면에서도 이 메뉴가 더 이상 보이지 않습니다.</p>
      <p class="form-error" id="form-error" role="alert"></p>
      <div class="detail-actions">
        <button class="button button--primary" id="delete-menu" type="button">삭제</button>
        <a class="button button--ghost" href="/src/admin/menu/read/detail/index.html?id=${menu.id}">취소</a>
      </div>
    </section>
  `
  : `
    <div class="empty-state">
      <p>삭제할 메뉴를 찾을 수 없습니다.</p>
      <a class="button button--primary" href="/src/admin/menu/read/list/index.html">목록</a>
    </div>
  `;

document.getElementById('delete-menu')?.addEventListener('click', async () => {
  const error = document.getElementById('form-error');

  try {
    await deleteMenu(menu.id);
    window.location.href = '/src/admin/menu/read/list/index.html';
  } catch (deleteError) {
    error.textContent = deleteError.message || '메뉴 삭제에 실패했습니다.';
  }
});
