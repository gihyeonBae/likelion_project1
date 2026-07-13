import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { getMenus } from '../../../shared/services/menu-service.js';
import { createOrder } from '../../../shared/services/order-service.js';
import { createPayment, PAYMENT_METHODS } from '../../../shared/services/payment-service.js';
import { formatCurrency } from '../../../shared/utils/format.js';
import { isPhoneNumber, isRequired } from '../../../shared/utils/validation.js';
import { calculateOrderItemsTotal } from '../../../customer/order/_shared/order-renderer.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const menus = (await getMenus()).filter((menu) => menu.status === 'on-sale');
const container = document.getElementById('pos-order-create');

container.innerHTML = menus.length
  ? `
    <form class="panel-form" id="pos-order-form">
      <p class="eyebrow">POS order</p>
      <h1>현장 주문 등록</h1>
      <label class="form-field">
        <span>메뉴</span>
        <select name="menuId">
          ${menus.map((menu) => `<option value="${menu.id}">${menu.nameKo} · ${formatCurrency(menu.price)}</option>`).join('')}
        </select>
      </label>
      <label class="form-field">
        <span>수량</span>
        <input type="number" name="quantity" value="1" min="1" required />
      </label>
      <label class="form-field">
        <span>픽업 이름</span>
        <input type="text" name="pickupName" value="현장 고객" required />
      </label>
      <label class="form-field">
        <span>연락처</span>
        <input type="tel" name="pickupPhone" value="010-0000-0000" required />
      </label>
      <label class="form-field">
        <span>픽업 시간</span>
        <input type="time" name="pickupTime" required />
      </label>
      <label class="form-field">
        <span>관리자 메모</span>
        <input type="text" name="adminMemo" placeholder="현장 결제 완료" />
      </label>
      <label class="form-field">
        <span>결제 수단</span>
        <select name="paymentMethod">
          ${PAYMENT_METHODS.map((method) => `<option value="${method.value}">${method.label}</option>`).join('')}
        </select>
      </label>
      <p class="form-error" id="form-error" role="alert"></p>
      <div class="detail-actions">
        <button class="button button--primary" type="submit">현장 주문 등록</button>
        <a class="button button--ghost" href="../read/list/index.html">목록</a>
      </div>
    </form>
  `
  : `
    <div class="empty-state">
      <p>판매중인 메뉴가 없습니다.</p>
      <a class="button button--primary" href="../../menu/create/index.html">메뉴 등록</a>
    </div>
  `;

document.getElementById('pos-order-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const menu = menus.find((item) => item.id === formData.get('menuId'));
  const quantity = Number(formData.get('quantity')) || 1;
  const pickupName = formData.get('pickupName');
  const pickupPhone = formData.get('pickupPhone');
  const pickupTime = formData.get('pickupTime');
  const error = document.getElementById('form-error');

  if (![pickupName, pickupPhone, pickupTime].every(isRequired)) {
    error.textContent = '픽업 이름, 연락처, 픽업 시간을 입력해 주세요.';
    return;
  }

  if (!isPhoneNumber(pickupPhone)) {
    error.textContent = '연락처 형식을 확인해 주세요.';
    return;
  }

  const items = [{
    menuId: menu.id,
    menuNameKo: menu.nameKo,
    menuNameEn: menu.nameEn,
    imageUrl: menu.imageUrl,
    imageTone: menu.imageTone,
    unitPrice: menu.price,
    quantity,
    options: { takeout: false },
    lineTotal: menu.price * quantity,
  }];
  const order = await createOrder({
    items,
    pickupName,
    pickupPhone,
    pickupTime,
    requestMessage: '현장 주문',
    adminMemo: formData.get('adminMemo'),
    totalPrice: calculateOrderItemsTotal(items),
    channel: 'pos',
  });
  await createPayment({
    order,
    method: formData.get('paymentMethod'),
  });

  window.location.href = `../read/detail/index.html?id=${order.id}`;
});
