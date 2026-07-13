import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { clearCartItems, getCartItems } from '../../../shared/services/cart-service.js';
import { getMenus } from '../../../shared/services/menu-service.js';
import { createOrder } from '../../../shared/services/order-service.js';
import { formatCurrency } from '../../../shared/utils/format.js';
import { isPhoneNumber, isRequired } from '../../../shared/utils/validation.js';
import { createOrderItemsFromCart, calculateOrderItemsTotal } from '../_shared/order-renderer.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('order', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const cartItems = getCartItems();
const menus = await getMenus();
const orderItems = createOrderItemsFromCart(cartItems, menus);
const totalPrice = calculateOrderItemsTotal(orderItems);
const container = document.getElementById('order-create');

if (!cartItems.length) {
  container.innerHTML = `
    <div class="empty-state">
      <p>주문할 메뉴가 없습니다.</p>
      <a class="button button--primary" href="../read/checkout/index.html">주문서로 돌아가기</a>
    </div>
  `;
} else {
  container.innerHTML = `
    <article class="cart-form-layout">
      <div class="confirm-panel">
        <p class="eyebrow">Order summary</p>
        <h1>${formatCurrency(totalPrice)}</h1>
        <p class="hero__description">총 ${orderItems.length}개 메뉴를 매장 픽업 주문으로 접수합니다.</p>
      </div>
      <form class="panel-form" id="order-form">
        <p class="eyebrow">Pickup</p>
        <h1>픽업 정보 입력</h1>
        <label class="form-field">
          <span>픽업 이름</span>
          <input type="text" name="pickupName" placeholder="홍길동" required />
        </label>
        <label class="form-field">
          <span>연락처</span>
          <input type="tel" name="pickupPhone" placeholder="010-0000-0000" required />
        </label>
        <label class="form-field">
          <span>픽업 시간</span>
          <input type="time" name="pickupTime" required />
        </label>
        <label class="form-field">
          <span>요청사항</span>
          <input type="text" name="requestMessage" placeholder="얼음 적게 주세요" />
        </label>
        <p class="form-error" id="form-error" role="alert"></p>
        <div class="detail-actions">
          <button class="button button--primary" type="submit">주문 생성</button>
          <a class="button button--ghost" href="../read/checkout/index.html">주문서로 돌아가기</a>
        </div>
      </form>
    </article>
  `;

  document.getElementById('order-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const pickupName = formData.get('pickupName');
    const pickupPhone = formData.get('pickupPhone');
    const pickupTime = formData.get('pickupTime');
    const requestMessage = formData.get('requestMessage');
    const error = document.getElementById('form-error');

    if (!isRequired(pickupName) || !isRequired(pickupPhone) || !isRequired(pickupTime)) {
      error.textContent = '픽업 이름, 연락처, 픽업 시간을 입력해 주세요.';
      return;
    }

    if (!isPhoneNumber(pickupPhone)) {
      error.textContent = '연락처 형식을 확인해 주세요.';
      return;
    }

    const order = await createOrder({
      items: orderItems,
      pickupName,
      pickupPhone,
      pickupTime,
      requestMessage,
      totalPrice,
    });
    clearCartItems();
    window.location.href = `../read/complete/index.html?id=${order.id}`;
  });
}
