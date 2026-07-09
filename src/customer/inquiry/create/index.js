import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { getCurrentCustomer } from '../../../shared/services/auth-service.js';
import { createInquiry } from '../../../shared/services/inquiry-service.js';
import { isRequired } from '../../../shared/utils/validation.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('inquiry', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const customer = getCurrentCustomer();
const container = document.getElementById('inquiry-create');

if (!customer) {
  container.innerHTML = `
    <div class="empty-state">
      <p>문의를 작성하려면 로그인이 필요합니다.</p>
      <a class="button button--primary" href="../../account/create/login/index.html">로그인</a>
    </div>
  `;
} else {
  container.innerHTML = `
    <form class="panel-form" id="inquiry-form">
      <p class="eyebrow">Inquiry</p>
      <h1>문의 작성</h1>
      <label class="form-field">
        <span>문의 유형</span>
        <select name="category">
          <option value="주문">주문</option>
          <option value="메뉴">메뉴</option>
          <option value="픽업">픽업</option>
          <option value="기타">기타</option>
        </select>
      </label>
      <label class="form-field">
        <span>제목</span>
        <input type="text" name="title" required />
      </label>
      <label class="form-field">
        <span>내용</span>
        <textarea name="message" rows="8" required></textarea>
      </label>
      <p class="form-error" id="form-error" role="alert"></p>
      <div class="detail-actions">
        <button class="button button--primary" type="submit">등록</button>
        <a class="button button--ghost" href="../read/list/index.html">목록</a>
      </div>
    </form>
  `;

  document.getElementById('inquiry-form').addEventListener('submit', (event) => {
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

    const inquiry = createInquiry({ title, category, message, customer });
    window.location.href = `../read/detail/index.html?id=${inquiry.id}`;
  });
}
