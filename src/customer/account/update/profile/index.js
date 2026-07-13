import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getCurrentCustomer, updateCurrentCustomer } from '../../../../shared/services/auth-service.js';
import { isPhoneNumber, isRequired } from '../../../../shared/utils/validation.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('account', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const customer = await getCurrentCustomer();
const container = document.getElementById('profile-update');

if (!customer) {
  container.innerHTML = `
    <div class="empty-state">
      <p>정보를 수정하려면 로그인이 필요합니다.</p>
      <a class="button button--primary" href="../../create/login/index.html">로그인</a>
    </div>
  `;
} else {
  container.innerHTML = `
    <form class="panel-form" id="profile-form">
      <p class="eyebrow">Profile</p>
      <h1>내 정보 수정</h1>
      <label class="form-field">
        <span>이름</span>
        <input type="text" name="name" value="${customer.name}" required />
      </label>
      <label class="form-field">
        <span>이메일</span>
        <input type="email" name="email" value="${customer.email}" required />
      </label>
      <label class="form-field">
        <span>연락처</span>
        <input type="tel" name="phone" value="${customer.phone}" required />
      </label>
      <label class="form-field">
        <span>새 비밀번호</span>
        <input type="password" name="password" minlength="4" placeholder="변경할 때만 입력" />
      </label>
      <p class="form-error" id="form-error" role="alert"></p>
      <div class="detail-actions">
        <button class="button button--primary" type="submit">저장</button>
        <a class="button button--ghost" href="../../read/profile/index.html">취소</a>
      </div>
    </form>
  `;

  document.getElementById('profile-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const error = document.getElementById('form-error');

    if (![name, email, phone].every(isRequired)) {
      error.textContent = '이름, 이메일, 연락처를 입력해 주세요.';
      return;
    }

    if (!isPhoneNumber(phone)) {
      error.textContent = '연락처 형식을 확인해 주세요.';
      return;
    }

    await updateCurrentCustomer({
      name,
      email,
      phone,
      ...(isRequired(password) ? { password } : {}),
    });
    window.location.href = '../../read/profile/index.html';
  });
}
