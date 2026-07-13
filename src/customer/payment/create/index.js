import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { formatCurrency } from '../../../shared/utils/format.js';
import { getOrderById } from '../../../shared/services/order-service.js';
import { createPayment, PAYMENT_METHODS } from '../../../shared/services/payment-service.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('order', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const params = new URLSearchParams(window.location.search);
const requestedOrderId = params.get('id');
const order = await getOrderById(requestedOrderId);
const container = document.getElementById('payment-create');

if (order && !requestedOrderId) {
  window.history.replaceState(null, '', `/src/customer/payment/create/index.html?id=${order.id}`);
}

if (!order) {
  container.innerHTML = `
    <div class="empty-state">
      <p>결제할 주문을 찾을 수 없습니다.</p>
      <a class="button button--primary" href="/src/customer/order/read/list/index.html">주문 내역</a>
    </div>
  `;
} else if (order.paymentStatus === 'paid') {
  container.innerHTML = `
    <section class="confirm-panel">
      <p class="eyebrow">Paid</p>
      <h1>이미 결제된 주문입니다</h1>
      <p class="hero__description">주문번호 ${order.id} · ${formatCurrency(order.totalPrice)}</p>
      <div class="detail-actions">
        <a class="button button--primary" href="/src/customer/order/read/detail/index.html?id=${order.id}">주문 상세 보기</a>
      </div>
    </section>
  `;
} else {
  container.innerHTML = `
    <article class="cart-form-layout">
      <section class="confirm-panel">
        <p class="eyebrow">Payment</p>
        <h1>${formatCurrency(order.totalPrice)}</h1>
        <p class="hero__description">주문번호 ${order.id} · 픽업 ${order.pickupTime}</p>
        <dl class="info-list">
          <div><dt>픽업 이름</dt><dd>${order.pickupName}</dd></div>
          <div><dt>연락처</dt><dd>${order.pickupPhone}</dd></div>
        </dl>
      </section>
      <form class="panel-form" id="payment-form">
        <p class="eyebrow">Pay now</p>
        <h1>결제 수단 선택</h1>
        <label class="form-field">
          <span>결제 수단</span>
          <select name="method">
            ${PAYMENT_METHODS.map((method) => `<option value="${method.value}">${method.label}</option>`).join('')}
          </select>
        </label>
        <p class="form-error" id="form-error" role="alert"></p>
        <div class="detail-actions">
          <button class="button button--primary" type="submit">결제 완료하기</button>
          <a class="button button--ghost" href="/src/customer/order/read/detail/index.html?id=${order.id}">주문 상세</a>
        </div>
      </form>
    </article>
  `;

  document.getElementById('payment-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const error = document.getElementById('form-error');

    try {
      await createPayment({
        order,
        method: formData.get('method'),
      });
      window.location.href = `/src/customer/order/read/complete/index.html?id=${order.id}`;
    } catch (paymentError) {
      error.textContent = paymentError.message;
    }
  });
}
