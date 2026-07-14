import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getOrderById } from '../../../../shared/services/order-service.js';
import { getPaymentMethodLabel } from '../../../../shared/services/payment-service.js';
import { formatCurrency } from '../../../../shared/utils/format.js';
import { createOrderItemRows, formatOrderDate, getOrderStatusLabel } from '../../_shared/order-renderer.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('order', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const params = new URLSearchParams(window.location.search);
const requestedOrderId = params.get('id');
const order = await getOrderById(requestedOrderId);
const container = document.getElementById('order-detail');

if (order && !requestedOrderId) {
  window.history.replaceState(null, '', `/src/customer/order/read/detail?id=${order.id}`);
}

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
          <div><dt>결제 상태</dt><dd>${order.paymentStatus === 'paid' ? '결제 완료' : '결제 전'}</dd></div>
          <div><dt>결제 수단</dt><dd>${order.paymentMethod ? getPaymentMethodLabel(order.paymentMethod) : '미결제'}</dd></div>
          <div><dt>영수증</dt><dd>${order.paymentReceiptId || '없음'}</dd></div>
        </dl>
        <strong class="detail-price">${formatCurrency(order.totalPrice)}</strong>
        <div class="detail-actions customer-order-actions">
          ${order.paymentStatus !== 'paid' && order.status !== 'canceled'
            ? `<a class="button button--primary" href="/src/customer/payment/create?id=${order.id}">결제하기</a>`
            : ''}
          <a class="button button--primary${order.status === 'canceled' ? ' is-disabled' : ''}" href="${order.status === 'canceled' ? '#' : `/src/customer/order/update?id=${order.id}`}">주문 수정</a>
          <a class="button button--ghost${order.status === 'canceled' ? ' is-disabled' : ''}" href="${order.status === 'canceled' ? '#' : `/src/customer/order/delete?id=${order.id}`}">주문 취소</a>
          <a class="button button--ghost" href="/src/customer/order/read/list">목록</a>
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
      <a class="button button--primary" href="/src/customer/order/read/list">주문 내역으로 이동</a>
    </div>
  `;
