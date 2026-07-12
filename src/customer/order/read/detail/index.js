import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getOrderById } from '../../../../shared/services/order-service.js';
import { formatCurrency } from '../../../../shared/utils/format.js';
import { createOrderItemRows, formatOrderDate, getOrderStatusLabel } from '../../_shared/order-renderer.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('order', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const order = getOrderById(new URLSearchParams(window.location.search).get('id'));
const container = document.getElementById('order-detail');

container.innerHTML = order
  ? `
    <article class="order-detail-layout">
      <section class="confirm-panel">
        <p class="eyebrow">${getOrderStatusLabel(order.status)}</p>
        <h1>${order.id}</h1>
        <p class="hero__description">${formatOrderDate(order.createdAt)} 접수 · 픽업 ${order.pickupTime}</p>
        <dl class="info-list">
          <div><dt>픽업 이름</dt><dd>${order.pickupName}</dd></div>
          <div><dt>연락처</dt><dd>${order.pickupPhone}</dd></div>
          <div><dt>요청사항</dt><dd>${order.requestMessage || '없음'}</dd></div>
          <div><dt>결제 상태</dt><dd>${order.paymentStatus === 'before-payment' ? '결제 전' : order.paymentStatus}</dd></div>
        </dl>
        <strong class="detail-price">${formatCurrency(order.totalPrice)}</strong>
        <div class="detail-actions">
          <a class="button button--primary${order.status === 'canceled' ? ' is-disabled' : ''}" href="${order.status === 'canceled' ? '#' : `../../update/index.html?id=${order.id}`}">주문 수정</a>
          <a class="button button--ghost${order.status === 'canceled' ? ' is-disabled' : ''}" href="${order.status === 'canceled' ? '#' : `../../delete/index.html?id=${order.id}`}">주문 취소</a>
          <a class="button button--ghost" href="../list/index.html">목록</a>
        </div>
      </section>
      <section class="cart-list">
        ${createOrderItemRows(order.items, { basePath })}
      </section>
    </article>
  `
  : `
    <div class="empty-state">
      <p>주문 상세를 찾을 수 없습니다.</p>
      <a class="button button--primary" href="../list/index.html">주문 내역으로 이동</a>
    </div>
  `;
