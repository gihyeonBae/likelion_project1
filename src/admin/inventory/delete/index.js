import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { deleteInventoryItem, getInventoryItemById } from '../../../shared/services/inventory-service.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const item = getInventoryItemById(new URLSearchParams(window.location.search).get('id'));
const container = document.getElementById('inventory-delete');

container.innerHTML = item
  ? `
    <section class="confirm-panel">
      <p class="eyebrow">Delete inventory</p>
      <h1>${item.name} 삭제</h1>
      <p class="hero__description">이 재고 항목과 입고 기록을 삭제합니다.</p>
      <div class="detail-actions">
        <button class="button button--primary" id="delete-inventory" type="button">삭제</button>
        <a class="button button--ghost" href="/src/admin/inventory/read/list">취소</a>
      </div>
    </section>
  `
  : `
    <div class="empty-state">
      <p>삭제할 재고를 찾을 수 없습니다.</p>
      <a class="button button--primary" href="/src/admin/inventory/read/list">목록</a>
    </div>
  `;

document.getElementById('delete-inventory')?.addEventListener('click', () => {
  deleteInventoryItem(item.id);
  window.location.href = '/src/admin/inventory/read/list';
});
