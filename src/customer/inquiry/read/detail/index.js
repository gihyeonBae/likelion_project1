import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getCurrentCustomer } from '../../../../shared/services/auth-service.js';
import { getInquiryById } from '../../../../shared/services/inquiry-service.js';
import { formatInquiryDate, getInquiryStatusLabel } from '../../_shared/inquiry-renderer.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('inquiry', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const customer = getCurrentCustomer();
const inquiry = getInquiryById(new URLSearchParams(window.location.search).get('id'));
const canAccess = customer && inquiry && inquiry.customerId === customer.id;
const container = document.getElementById('inquiry-detail');

container.innerHTML = canAccess
  ? `
    <article class="confirm-panel">
      <p class="eyebrow">${getInquiryStatusLabel(inquiry.status)}</p>
      <h1>${inquiry.title}</h1>
      <dl class="info-list">
        <div><dt>유형</dt><dd>${inquiry.category}</dd></div>
        <div><dt>작성자</dt><dd>${inquiry.customerName}</dd></div>
        <div><dt>작성일</dt><dd>${formatInquiryDate(inquiry.createdAt)}</dd></div>
      </dl>
      <div class="message-panel">
        <h2>문의 내용</h2>
        <p>${inquiry.message}</p>
      </div>
      <div class="message-panel">
        <h2>답변</h2>
        <p>${inquiry.answer || '아직 답변이 등록되지 않았습니다.'}</p>
      </div>
      <div class="detail-actions">
        <a class="button button--primary" href="../../update/index.html?id=${inquiry.id}">수정</a>
        <a class="button button--ghost" href="../../delete/index.html?id=${inquiry.id}">삭제</a>
        <a class="button button--ghost" href="../list/index.html">목록</a>
      </div>
    </article>
  `
  : `
    <div class="empty-state">
      <p>문의 정보를 찾을 수 없습니다.</p>
      <a class="button button--primary" href="../list/index.html">문의 목록</a>
    </div>
  `;
