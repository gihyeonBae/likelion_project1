import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getOrders } from '../../../../shared/services/order-service.js';
import { createAdminOrderRow } from '../../_shared/admin-order.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const orders = getOrders();
const statusFilter = document.getElementById('status-filter');

function renderOrders() {
  const filteredOrders = orders.filter((order) => statusFilter.value === 'all' || order.status === statusFilter.value);

  document.getElementById('order-summary').textContent = `관리 주문 ${filteredOrders.length}건`;
  document.getElementById('admin-order-list').innerHTML = filteredOrders.length
    ? filteredOrders.map((order) => createAdminOrderRow(order, { basePath })).join('')
    : `
      <div class="empty-state">
        <p>조건에 맞는 주문이 없습니다.</p>
        <a class="button button--primary" href="../../create/index.html">현장 주문 등록</a>
      </div>
    `;
}

statusFilter.addEventListener('change', renderOrders);
renderOrders();
