import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { getCurrentCustomer } from '../../../shared/services/auth-service.js';
import { deleteInquiry, getInquiryById } from '../../../shared/services/inquiry-service.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('inquiry', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const customer = getCurrentCustomer();
const inquiry = getInquiryById(new URLSearchParams(window.location.search).get('id'));
const canDelete = customer && inquiry && inquiry.customerId === customer.id && inquiry.status === 'waiting';
const container = document.getElementById('inquiry-delete');

container.innerHTML = canDelete
  ? `
    <section class="confirm-panel">
      <p class="eyebrow">Delete inquiry</p>
      <h1>문의를 삭제할까요?</h1>
      <p class="hero__description">${inquiry.title} 문의를 삭제합니다.</p>
      <div class="detail-actions">
        <button class="button button--primary" id="delete-inquiry" type="button">삭제</button>
        <a class="button button--ghost" href="../read/detail/index.html?id=${inquiry.id}">취소</a>
      </div>
    </section>
  `
  : `
    <div class="empty-state">
      <p>삭제할 수 있는 문의가 없습니다.</p>
      <a class="button button--primary" href="../read/list/index.html">문의 목록</a>
    </div>
  `;

document.getElementById('delete-inquiry')?.addEventListener('click', () => {
  deleteInquiry(inquiry.id);
  window.location.href = '../read/list/index.html';
});
