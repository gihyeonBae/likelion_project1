import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { createInventoryItem } from '../../../shared/services/inventory-service.js';
import { isRequired } from '../../../shared/utils/validation.js';
import { createInventoryForm, getInventoryPayloadFromForm } from '../_shared/admin-inventory.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();
document.getElementById('inventory-create').innerHTML = createInventoryForm({ submitLabel: '재고 등록' });

document.getElementById('inventory-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const payload = getInventoryPayloadFromForm(event.currentTarget);
  const error = document.getElementById('form-error');

  if (![payload.name, payload.category, payload.unit].every(isRequired)) {
    error.textContent = '재고명, 분류, 단위를 입력해 주세요.';
    return;
  }

  const item = createInventoryItem({
    ...payload,
    initialHistory: {
      type: '입고',
      quantityChange: payload.quantity,
      memo: '초기 등록',
      createdAt: new Date().toISOString(),
    },
  });
  window.location.href = `/src/admin/inventory/read/history/index.html?id=${item.id}`;
});
