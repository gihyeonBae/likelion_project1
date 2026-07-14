import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getOrderById } from '../../../../shared/services/order-service.js';
import { createAdminOrderDetail } from '../../_shared/admin-order.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const order = await getOrderById(new URLSearchParams(window.location.search).get('id'));
const container = document.getElementById('admin-order-detail');
const statusLink = document.getElementById('status-link');
const deleteLink = document.getElementById('delete-link');

if (!order) {
  container.innerHTML = `
    <div class="empty-state">
      <p>주문을 찾을 수 없습니다.</p>
      <a class="button button--primary" href="/src/admin/order/read/list">목록</a>
    </div>
  `;
  statusLink.classList.add('is-disabled');
  deleteLink.classList.add('is-disabled');
} else {
  container.innerHTML = createAdminOrderDetail(order, { basePath });
  statusLink.href = `/src/admin/order/update/status?id=${order.id}`;
  deleteLink.href = `/src/admin/order/delete?id=${order.id}`;
}
