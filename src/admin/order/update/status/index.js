import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getOrderById, updateOrder } from '../../../../shared/services/order-service.js';
import { ORDER_STATUSES } from '../../_shared/admin-order.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const order = await getOrderById(new URLSearchParams(window.location.search).get('id'));
const container = document.getElementById('order-status-update');

if (!order) {
  container.innerHTML = `
    <div class="empty-state">
      <p>상태를 변경할 주문을 찾을 수 없습니다.</p>
      <a class="button button--primary" href="/src/admin/order/read/list/index.html">목록</a>
    </div>
  `;
} else {
  container.innerHTML = `
    <form class="panel-form" id="status-form">
      <p class="eyebrow">Order status</p>
      <h1>${order.id}</h1>
      <label class="form-field">
        <span>주문 상태</span>
        <select name="status">
          ${ORDER_STATUSES.map((status) => `<option value="${status.value}"${status.value === order.status ? ' selected' : ''}>${status.label}</option>`).join('')}
        </select>
      </label>
      <label class="form-field">
        <span>관리자 메모</span>
        <textarea name="adminMemo" rows="4">${order.adminMemo ?? ''}</textarea>
      </label>
      <div class="detail-actions">
        <button class="button button--primary" type="submit">상태 저장</button>
        <a class="button button--ghost" href="/src/admin/order/read/detail/index.html?id=${order.id}">취소</a>
      </div>
    </form>
  `;

  document.getElementById('status-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await updateOrder(order.id, {
      status: formData.get('status'),
      adminMemo: formData.get('adminMemo'),
    });
    window.location.href = `/src/admin/order/read/detail/index.html?id=${order.id}`;
  });
}
