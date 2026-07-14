import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getCurrentCustomer } from '../../../../shared/services/auth-service.js';
import { getOrders } from '../../../../shared/services/order-service.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('account', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const customer = await getCurrentCustomer();
const container = document.getElementById('profile-view');

if (!customer) {
  container.innerHTML = `
    <div class="empty-state">
      <p>내 정보를 보려면 로그인이 필요합니다.</p>
      <a class="button button--primary" href="/src/customer/account/create/login">로그인</a>
      <a class="button button--ghost" href="/src/customer/account/create/signup">회원가입</a>
    </div>
  `;
} else {
  const orderCount = (await getOrders()).length;

  container.innerHTML = `
    <article class="confirm-panel">
      <p class="eyebrow">My page</p>
      <h1>${customer.name}</h1>
      <dl class="info-list">
        <div><dt>이메일</dt><dd>${customer.email}</dd></div>
        <div><dt>연락처</dt><dd>${customer.phone}</dd></div>
        <div><dt>주문</dt><dd>${orderCount}건</dd></div>
      </dl>
      <div class="detail-actions">
        <a class="button button--primary" href="/src/customer/account/update/profile">내 정보 수정</a>
        <a class="button button--ghost" href="/src/customer/account/delete/logout">로그아웃</a>
        <a class="button button--ghost" href="/src/customer/account/delete/withdraw">회원 탈퇴</a>
      </div>
    </article>
  `;
}
