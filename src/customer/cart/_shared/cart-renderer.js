import { formatCurrency } from '../../../shared/utils/format.js';

export function getCartMenu(cartItem, menus) {
  return menus.find((menu) => menu.id === cartItem.menuId) || null;
}

export function calculateCartLineTotal(cartItem, menu) {
  return menu ? menu.price * cartItem.quantity : 0;
}

export function calculateCartTotal(cartItems, menus) {
  return cartItems.reduce((total, item) => total + calculateCartLineTotal(item, getCartMenu(item, menus)), 0);
}

export function formatCartOptions(options = {}) {
  const labels = [];

  if (options.temperature) {
    labels.push(options.temperature === 'ice' ? 'ICE' : 'HOT');
  }

  if (options.size) {
    labels.push(options.size === 'large' ? 'Large' : 'Regular');
  }

  if (Number(options.extraShotCount) > 0) {
    labels.push(`샷 ${options.extraShotCount}회 추가`);
  }

  if (Number(options.syrupCount) > 0) {
    labels.push(`시럽 ${options.syrupCount}회 추가`);
  }

  labels.push(options.takeout ? '포장' : '매장');
  return labels.join(' · ');
}

export function createCartItemCard(cartItem, menu, { basePath }) {
  if (!menu) {
    return `
      <article class="cart-item">
        <div>
          <p class="eyebrow">Unavailable</p>
          <h3>삭제된 메뉴</h3>
          <p class="menu-card__meta">이 메뉴는 더 이상 판매 목록에 없습니다.</p>
        </div>
        <a class="button button--ghost" href="${basePath}/src/customer/cart/delete/index.html?id=${cartItem.id}">삭제</a>
      </article>
    `;
  }

  return `
    <article class="cart-item">
      <div class="cart-item__visual menu-card--${menu.imageTone}">
        <span>${menu.nameEn}</span>
      </div>
      <div class="cart-item__body">
        <p class="eyebrow">${menu.categoryId}</p>
        <h3>${menu.nameKo}</h3>
        <p class="menu-card__meta">${formatCartOptions(cartItem.options)}</p>
        <p>${formatCurrency(menu.price)} × ${cartItem.quantity}</p>
      </div>
      <strong>${formatCurrency(calculateCartLineTotal(cartItem, menu))}</strong>
      <div class="cart-item__actions">
        <a class="button button--ghost" href="${basePath}/src/customer/cart/update/index.html?id=${cartItem.id}">수정</a>
        <a class="button button--ghost" href="${basePath}/src/customer/cart/delete/index.html?id=${cartItem.id}">삭제</a>
      </div>
    </article>
  `;
}
