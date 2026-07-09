import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getInventoryItems } from '../../../../shared/services/inventory-service.js';
import { createInventoryRow, getComputedInventoryStatus } from '../../_shared/admin-inventory.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const inventoryItems = getInventoryItems();
const statusFilter = document.getElementById('status-filter');

function renderInventory() {
  const filteredItems = inventoryItems.filter((item) => statusFilter.value === 'all' || getComputedInventoryStatus(item) === statusFilter.value);

  document.getElementById('inventory-summary').textContent = `재고 항목 ${filteredItems.length}개`;
  document.getElementById('inventory-list').innerHTML = filteredItems.length
    ? filteredItems.map((item) => createInventoryRow(item, { basePath })).join('')
    : `
      <div class="empty-state">
        <p>조건에 맞는 재고가 없습니다.</p>
        <a class="button button--primary" href="../../create/index.html">재고 등록</a>
      </div>
    `;
}

statusFilter.addEventListener('change', renderInventory);
renderInventory();
