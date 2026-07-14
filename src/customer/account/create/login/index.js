import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { loginCustomer } from '../../../../shared/services/auth-service.js';
import { isRequired } from '../../../../shared/utils/validation.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('account', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const email = formData.get('email');
  const password = formData.get('password');
  const error = document.getElementById('form-error');

  if (![email, password].every(isRequired)) {
    error.textContent = '이메일과 비밀번호를 입력해 주세요.';
    return;
  }

  try {
    await loginCustomer({ email, password });
    window.location.href = '/src/customer/account/read/profile';
  } catch (loginError) {
    error.textContent = loginError.message;
  }
});
