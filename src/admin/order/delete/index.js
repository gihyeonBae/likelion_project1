import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { deleteOrder, getOrderById } from '../../../shared/services/order-service.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const order = getOrderById(new URLSearchParams(window.location.search).get('id'));
const container = document.getElementById('order-delete');

container.innerHTML = order
  ? `
    <section class="confirm-panel">
      <p class="eyebrow">Delete order</p>
      <h1>테스트 주문 삭제</h1>
      <p class="hero__description">${order.id} 주문을 목록에서 완전히 삭제합니다.</p>
      <div class="detail-actions">
        <button class="button button--primary" id="delete-order" type="button">삭제</button>
        <a class="button button--ghost" href="../read/detail/index.html?id=${order.id}">취소</a>
      </div>
    </section>
  `
  : `
    <div class="empty-state">
      <p>삭제할 주문을 찾을 수 없습니다.</p>
      <a class="button button--primary" href="../read/list/index.html">목록</a>
    </div>
  `;

document.getElementById('delete-order')?.addEventListener('click', () => {
  deleteOrder(order.id);
  window.location.href = '../read/list/index.html';
});
