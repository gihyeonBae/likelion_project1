import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { cancelOrder, getOrderById } from '../../../shared/services/order-service.js';
import { formatCurrency } from '../../../shared/utils/format.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('order', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const order = getOrderById(new URLSearchParams(window.location.search).get('id'));
const container = document.getElementById('order-delete');

container.innerHTML = order && order.status !== 'canceled'
  ? `
    <section class="confirm-panel">
      <p class="eyebrow">Cancel</p>
      <h1>주문을 취소할까요?</h1>
      <p class="hero__description">${order.id} · ${formatCurrency(order.totalPrice)} 주문을 취소합니다.</p>
      <div class="detail-actions">
        <button class="button button--primary" id="cancel-order" type="button">주문 취소</button>
        <a class="button button--ghost" href="../read/detail/index.html?id=${order.id}">돌아가기</a>
      </div>
    </section>
  `
  : `
    <div class="empty-state">
      <p>취소할 수 있는 주문이 없습니다.</p>
      <a class="button button--primary" href="../read/list/index.html">주문 내역</a>
    </div>
  `;

document.getElementById('cancel-order')?.addEventListener('click', () => {
  cancelOrder(order.id);
  window.location.href = `../read/detail/index.html?id=${order.id}`;
});
