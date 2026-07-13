import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getOrderById } from '../../../../shared/services/order-service.js';
import { formatCurrency } from '../../../../shared/utils/format.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('order', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const order = await getOrderById(new URLSearchParams(window.location.search).get('id'));
const container = document.getElementById('order-complete');

container.innerHTML = order
  ? `
    <section class="confirm-panel">
      <p class="eyebrow">Complete</p>
      <h1>주문이 접수되었습니다</h1>
      <p class="hero__description">주문번호 ${order.id} · 픽업 ${order.pickupTime} · ${formatCurrency(order.totalPrice)}</p>
      <div class="detail-actions">
        <a class="button button--primary" href="../detail/index.html?id=${order.id}">주문 상세 보기</a>
        <a class="button button--ghost" href="../list/index.html">주문 내역</a>
      </div>
    </section>
  `
  : `
    <div class="empty-state">
      <p>주문 정보를 찾을 수 없습니다.</p>
      <a class="button button--primary" href="../list/index.html">주문 내역으로 이동</a>
    </div>
  `;
