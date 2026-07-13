import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getCartItems } from '../../../../shared/services/cart-service.js';
import { getMenus } from '../../../../shared/services/menu-service.js';
import { formatCurrency } from '../../../../shared/utils/format.js';
import { calculateCartTotal, createCartItemCard } from '../../../cart/_shared/cart-renderer.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('order', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const cartItems = getCartItems();
const menus = await getMenus();
const checkoutItems = document.getElementById('checkout-items');

checkoutItems.innerHTML = cartItems.length
  ? cartItems.map((item) => createCartItemCard(item, menus.find((menu) => menu.id === item.menuId), { basePath })).join('')
  : `
    <div class="empty-state">
      <p>주문할 메뉴가 없습니다.</p>
      <a class="button button--primary" href="../../../menu/read/list/index.html">메뉴 담으러 가기</a>
    </div>
  `;

document.getElementById('checkout-total').textContent = formatCurrency(calculateCartTotal(cartItems, menus));

if (!cartItems.length) {
  const createLink = document.getElementById('create-order-link');
  createLink.href = '#';
  createLink.setAttribute('aria-disabled', 'true');
  createLink.classList.add('is-disabled');
}
