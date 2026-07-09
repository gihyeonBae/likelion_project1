import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { getInventoryItemById, updateInventoryItem } from '../../../shared/services/inventory-service.js';
import { isRequired } from '../../../shared/utils/validation.js';
import { createInventoryForm, getInventoryPayloadFromForm } from '../_shared/admin-inventory.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const item = getInventoryItemById(new URLSearchParams(window.location.search).get('id'));
const container = document.getElementById('inventory-update');

if (!item) {
  container.innerHTML = `
    <div class="empty-state">
      <p>수정할 재고를 찾을 수 없습니다.</p>
      <a class="button button--primary" href="../read/list/index.html">목록</a>
    </div>
  `;
} else {
  container.innerHTML = createInventoryForm({ item, submitLabel: '수정 저장' });

  document.getElementById('inventory-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const payload = getInventoryPayloadFromForm(event.currentTarget);
    const error = document.getElementById('form-error');

    if (![payload.name, payload.category, payload.unit].every(isRequired)) {
      error.textContent = '재고명, 분류, 단위를 입력해 주세요.';
      return;
    }

    updateInventoryItem(item.id, payload);
    window.location.href = '../read/list/index.html';
  });
}
