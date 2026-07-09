import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getCustomerById } from '../../../../shared/services/auth-service.js';
import { getInquiries } from '../../../../shared/services/inquiry-service.js';
import { getOrders } from '../../../../shared/services/order-service.js';
import { formatCustomerDate, getCustomerStatusLabel } from '../../_shared/admin-customer.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const customer = getCustomerById(new URLSearchParams(window.location.search).get('id'));
const container = document.getElementById('customer-detail');

if (!customer) {
  container.innerHTML = `
    <div class="empty-state">
      <p>고객을 찾을 수 없습니다.</p>
      <a class="button button--primary" href="../list/index.html">목록</a>
    </div>
  `;
} else {
  const inquiries = getInquiries().filter((inquiry) => inquiry.customerId === customer.id);
  const orderCount = getOrders().length;

  container.innerHTML = `
    <article class="confirm-panel">
      <p class="eyebrow">${getCustomerStatusLabel(customer.status)}</p>
      <h1>${customer.name}</h1>
      <dl class="info-list">
        <div><dt>이메일</dt><dd>${customer.email}</dd></div>
        <div><dt>연락처</dt><dd>${customer.phone}</dd></div>
        <div><dt>가입일</dt><dd>${formatCustomerDate(customer.createdAt)}</dd></div>
        <div><dt>문의</dt><dd>${inquiries.length}건</dd></div>
        <div><dt>전체 주문</dt><dd>${orderCount}건</dd></div>
      </dl>
      <div class="message-panel">
        <h2>최근 문의</h2>
        ${inquiries.length ? inquiries.slice(0, 3).map((inquiry) => `<p>${inquiry.title} · ${inquiry.status}</p>`).join('') : '<p>문의 내역이 없습니다.</p>'}
      </div>
      <div class="detail-actions">
        <a class="button button--primary" href="../../update/status/index.html?id=${customer.id}">상태 수정</a>
        <a class="button button--ghost" href="../list/index.html">목록</a>
      </div>
    </article>
  `;
}
