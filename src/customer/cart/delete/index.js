import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { clearCartItems, getCartItemById, removeCartItem } from '../../../shared/services/cart-service.js';
import { getMenuById } from '../../../shared/services/menu-service.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('cart', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const params = new URLSearchParams(window.location.search);
const shouldClear = params.get('clear') === 'true';
const cartItem = getCartItemById(params.get('id'));
const liveMenu = cartItem ? await getMenuById(cartItem.menuId) : null;
const menu = liveMenu || cartItem?.menuSnapshot || null;
const container = document.getElementById('cart-delete');

container.innerHTML = `
  <section class="confirm-panel">
    <p class="eyebrow">Delete</p>
    <h1>${shouldClear ? '장바구니 전체 비우기' : '장바구니 메뉴 삭제'}</h1>
    <p class="hero__description">
      ${shouldClear ? '담아둔 모든 메뉴를 장바구니에서 비웁니다.' : `${menu?.nameKo ?? '선택한 메뉴'}를 장바구니에서 삭제합니다.`}
    </p>
    <div class="detail-actions">
      <button class="button button--primary" id="confirm-delete" type="button">삭제하기</button>
      <a class="button button--ghost" href="/src/customer/cart/read/index.html">취소</a>
    </div>
  </section>
`;

document.getElementById('confirm-delete').addEventListener('click', () => {
  if (shouldClear) {
    clearCartItems();
  } else if (cartItem) {
    removeCartItem(cartItem.id);
  }

  window.location.href = '/src/customer/cart/read/index.html';
});
