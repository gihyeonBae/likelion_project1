import { formatCurrency } from '../../../shared/utils/format.js';
import { formatCartOptions } from '../../cart/_shared/cart-renderer.js';

export function createOrderItemSnapshot(cartItem, menu) {
  return {
    menuId: cartItem.menuId,
    menuNameKo: menu?.nameKo ?? '삭제된 메뉴',
    menuNameEn: menu?.nameEn ?? 'Unavailable',
    imageTone: menu?.imageTone ?? 'coffee',
    unitPrice: menu?.price ?? 0,
    quantity: cartItem.quantity,
    options: cartItem.options,
    lineTotal: (menu?.price ?? 0) * cartItem.quantity,
  };
}

export function createOrderItemsFromCart(cartItems, menus) {
  return cartItems.map((cartItem) => createOrderItemSnapshot(
    cartItem,
    menus.find((menu) => menu.id === cartItem.menuId),
  ));
}

export function calculateOrderItemsTotal(items) {
  return items.reduce((total, item) => total + item.lineTotal, 0);
}

export function getOrderStatusLabel(status) {
  const labels = {
    received: '주문 접수',
    making: '제조중',
    ready: '픽업대기',
    complete: '완료',
    canceled: '취소',
  };

  return labels[status] ?? status;
}

export function formatOrderDate(value) {
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function createOrderItemRows(items) {
  return items.map((item) => `
    <article class="cart-item">
      <div class="cart-item__visual menu-card--${item.imageTone}">
        <span>${item.menuNameEn}</span>
      </div>
      <div class="cart-item__body">
        <p class="eyebrow">${item.menuNameEn}</p>
        <h3>${item.menuNameKo}</h3>
        <p class="menu-card__meta">${formatCartOptions(item.options)}</p>
        <p>${formatCurrency(item.unitPrice)} × ${item.quantity}</p>
      </div>
      <strong>${formatCurrency(item.lineTotal)}</strong>
    </article>
  `).join('');
}

export function createOrderListCard(order, { basePath }) {
  const firstItem = order.items[0];
  const itemLabel = order.items.length > 1
    ? `${firstItem.menuNameKo} 외 ${order.items.length - 1}개`
    : firstItem?.menuNameKo ?? '메뉴 없음';

  return `
    <article class="order-card">
      <div>
        <p class="eyebrow">${getOrderStatusLabel(order.status)}</p>
        <h3>${itemLabel}</h3>
        <p class="menu-card__meta">${formatOrderDate(order.createdAt)} · 픽업 ${order.pickupTime}</p>
      </div>
      <strong>${formatCurrency(order.totalPrice)}</strong>
      <a class="button button--ghost" href="${basePath}/src/customer/order/read/detail/index.html?id=${order.id}">상세</a>
    </article>
  `;
}
