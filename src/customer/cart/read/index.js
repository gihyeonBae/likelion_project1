import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { getCartItems } from '../../../shared/services/cart-service.js';
import { getMenus } from '../../../shared/services/menu-service.js';
import { formatCurrency } from '../../../shared/utils/format.js';
import { calculateCartTotal, createCartItemCard } from '../_shared/cart-renderer.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('cart', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const cartItems = getCartItems();
const menus = getMenus();
const cartList = document.getElementById('cart-list');

cartList.innerHTML = cartItems.length
  ? cartItems.map((item) => createCartItemCard(item, menus.find((menu) => menu.id === item.menuId), { basePath })).join('')
  : `
    <div class="empty-state">
      <p>장바구니가 비어 있습니다.</p>
      <a class="button button--primary" href="../../menu/read/list/index.html">메뉴 담으러 가기</a>
    </div>
  `;

document.getElementById('cart-total').textContent = formatCurrency(calculateCartTotal(cartItems, menus));

if (!cartItems.length) {
  const checkoutLink = document.getElementById('checkout-link');
  checkoutLink.setAttribute('aria-disabled', 'true');
  checkoutLink.classList.add('is-disabled');
  checkoutLink.href = '#';
}
