import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { signupCustomer } from '../../../../shared/services/auth-service.js';
import { isPhoneNumber, isRequired } from '../../../../shared/utils/validation.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('account', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

document.getElementById('signup-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const phone = formData.get('phone');
  const error = document.getElementById('form-error');

  if (![name, email, password, phone].every(isRequired)) {
    error.textContent = '모든 항목을 입력해 주세요.';
    return;
  }

  if (!isPhoneNumber(phone)) {
    error.textContent = '연락처 형식을 확인해 주세요.';
    return;
  }

  try {
    await signupCustomer({ name, email, password, phone });
    window.location.href = '/src/customer/account/read/profile';
  } catch (signupError) {
    error.textContent = signupError.message;
  }
});
