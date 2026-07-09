import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { getCurrentCustomer } from '../../../shared/services/auth-service.js';
import { getInquiryById, updateInquiry } from '../../../shared/services/inquiry-service.js';
import { isRequired } from '../../../shared/utils/validation.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('inquiry', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const customer = getCurrentCustomer();
const inquiry = getInquiryById(new URLSearchParams(window.location.search).get('id'));
const canEdit = customer && inquiry && inquiry.customerId === customer.id && inquiry.status === 'waiting';
const container = document.getElementById('inquiry-update');

if (!canEdit) {
  container.innerHTML = `
    <div class="empty-state">
      <p>수정할 수 있는 문의가 없습니다.</p>
      <a class="button button--primary" href="../read/list/index.html">문의 목록</a>
    </div>
  `;
} else {
  container.innerHTML = `
    <form class="panel-form" id="inquiry-update-form">
      <p class="eyebrow">Update inquiry</p>
      <h1>문의 수정</h1>
      <label class="form-field">
        <span>문의 유형</span>
        <select name="category">
          ${['주문', '메뉴', '픽업', '기타'].map((category) => `<option value="${category}"${category === inquiry.category ? ' selected' : ''}>${category}</option>`).join('')}
        </select>
      </label>
      <label class="form-field">
        <span>제목</span>
        <input type="text" name="title" value="${inquiry.title}" required />
      </label>
      <label class="form-field">
        <span>내용</span>
        <textarea name="message" rows="8" required>${inquiry.message}</textarea>
      </label>
      <p class="form-error" id="form-error" role="alert"></p>
      <div class="detail-actions">
        <button class="button button--primary" type="submit">저장</button>
        <a class="button button--ghost" href="../read/detail/index.html?id=${inquiry.id}">취소</a>
      </div>
    </form>
  `;

  document.getElementById('inquiry-update-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = formData.get('title');
    const category = formData.get('category');
    const message = formData.get('message');
    const error = document.getElementById('form-error');

    if (![title, category, message].every(isRequired)) {
      error.textContent = '문의 유형, 제목, 내용을 입력해 주세요.';
      return;
    }

    updateInquiry(inquiry.id, { title, category, message });
    window.location.href = `../read/detail/index.html?id=${inquiry.id}`;
  });
}
