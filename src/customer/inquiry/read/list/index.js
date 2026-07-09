import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getCurrentCustomer } from '../../../../shared/services/auth-service.js';
import { getCurrentCustomerInquiries } from '../../../../shared/services/inquiry-service.js';
import { createInquiryCard } from '../../_shared/inquiry-renderer.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('inquiry', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const customer = getCurrentCustomer();
const inquiries = getCurrentCustomerInquiries();
const list = document.getElementById('inquiry-list');

if (!customer) {
  list.innerHTML = `
    <div class="empty-state">
      <p>문의 목록을 보려면 로그인이 필요합니다.</p>
      <a class="button button--primary" href="../../../account/create/login/index.html">로그인</a>
    </div>
  `;
} else {
  list.innerHTML = inquiries.length
    ? inquiries.map((inquiry) => createInquiryCard(inquiry, { basePath })).join('')
    : `
      <div class="empty-state">
        <p>아직 작성한 문의가 없습니다.</p>
        <a class="button button--primary" href="../../create/index.html">문의 작성</a>
      </div>
    `;
}
