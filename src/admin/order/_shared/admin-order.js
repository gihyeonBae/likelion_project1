import { formatCurrency } from '../../../shared/utils/format.js';
import { getPaymentMethodLabel } from '../../../shared/services/payment-service.js';
import { createOrderItemRows, formatOrderDate, getOrderStatusLabel } from '../../../customer/order/_shared/order-renderer.js';

export const ORDER_STATUSES = [
  { value: 'received', label: '주문 접수' },
  { value: 'making', label: '제조중' },
  { value: 'ready', label: '픽업대기' },
  { value: 'complete', label: '완료' },
  { value: 'canceled', label: '취소' },
];

export function createAdminOrderRow(order, { basePath }) {
  const firstItem = order.items[0];
  const itemLabel = order.items.length > 1
    ? `${firstItem.menuNameKo} 외 ${order.items.length - 1}개`
    : firstItem?.menuNameKo ?? '메뉴 없음';

  return `
    <article class="order-card">
      <div>
        <p class="eyebrow">${getOrderStatusLabel(order.status)} · ${order.channel === 'pos' ? '현장' : '온라인'} · ${order.paymentStatus === 'paid' ? '결제 완료' : '결제 전'}</p>
        <h3>${itemLabel}</h3>
        <p class="menu-card__meta">${formatOrderDate(order.createdAt)} · ${order.pickupName} · 픽업 ${order.pickupTime}</p>
      </div>
      <strong>${formatCurrency(order.totalPrice)}</strong>
      <div class="cart-item__actions">
        <a class="button button--ghost" href="${basePath}/src/admin/order/read/detail/index.html?id=${order.id}">상세</a>
        <a class="button button--ghost" href="${basePath}/src/admin/order/update/status/index.html?id=${order.id}">상태</a>
      </div>
    </article>
  `;
}

export function createAdminOrderDetail(order, { basePath = '../../../../..' } = {}) {
  return `
    <article class="order-detail-layout">
      <section class="confirm-panel">
        <p class="eyebrow">${getOrderStatusLabel(order.status)} · ${order.channel === 'pos' ? '현장 주문' : '온라인 주문'}</p>
        <h1>${order.id}</h1>
        <p class="hero__description">${formatOrderDate(order.createdAt)} 접수 · 픽업 ${order.pickupTime}</p>
        <dl class="info-list">
          <div><dt>고객</dt><dd>${order.pickupName}</dd></div>
          <div><dt>연락처</dt><dd>${order.pickupPhone}</dd></div>
          <div><dt>요청사항</dt><dd>${order.requestMessage || '없음'}</dd></div>
          <div><dt>관리 메모</dt><dd>${order.adminMemo || '없음'}</dd></div>
          <div><dt>결제 상태</dt><dd>${order.paymentStatus === 'paid' ? '결제 완료' : '결제 전'}</dd></div>
          <div><dt>결제 수단</dt><dd>${order.paymentMethod ? getPaymentMethodLabel(order.paymentMethod) : '미결제'}</dd></div>
          <div><dt>영수증</dt><dd>${order.paymentReceiptId || '없음'}</dd></div>
        </dl>
        <strong class="detail-price">${formatCurrency(order.totalPrice)}</strong>
      </section>
      <section class="cart-list">
        ${createOrderItemRows(order.items, { basePath })}
      </section>
    </article>
  `;
}
