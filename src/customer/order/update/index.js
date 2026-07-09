import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { getOrderById, updateOrder } from '../../../shared/services/order-service.js';
import { isPhoneNumber, isRequired } from '../../../shared/utils/validation.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('order', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const order = getOrderById(new URLSearchParams(window.location.search).get('id'));
const container = document.getElementById('order-update');

if (!order || order.status === 'canceled') {
  container.innerHTML = `
    <div class="empty-state">
      <p>수정할 수 있는 주문이 없습니다.</p>
      <a class="button button--primary" href="../read/list/index.html">주문 내역</a>
    </div>
  `;
} else {
  container.innerHTML = `
    <form class="panel-form" id="order-update-form">
      <p class="eyebrow">Update order</p>
      <h1>픽업 정보 수정</h1>
      <label class="form-field">
        <span>픽업 이름</span>
        <input type="text" name="pickupName" value="${order.pickupName}" required />
      </label>
      <label class="form-field">
        <span>연락처</span>
        <input type="tel" name="pickupPhone" value="${order.pickupPhone}" required />
      </label>
      <label class="form-field">
        <span>픽업 시간</span>
        <input type="time" name="pickupTime" value="${order.pickupTime}" required />
      </label>
      <label class="form-field">
        <span>요청사항</span>
        <input type="text" name="requestMessage" value="${order.requestMessage}" />
      </label>
      <p class="form-error" id="form-error" role="alert"></p>
      <div class="detail-actions">
        <button class="button button--primary" type="submit">수정 저장</button>
        <a class="button button--ghost" href="../read/detail/index.html?id=${order.id}">취소</a>
      </div>
    </form>
  `;

  document.getElementById('order-update-form').addEventListener('submit', (event) => {
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

    updateOrder(order.id, {
      pickupName,
      pickupPhone,
      pickupTime,
      requestMessage,
    });
    window.location.href = `../read/detail/index.html?id=${order.id}`;
  });
}
