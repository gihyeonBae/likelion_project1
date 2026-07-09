import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { withdrawCurrentCustomer } from '../../../../shared/services/auth-service.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('account', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

document.getElementById('withdraw-button').addEventListener('click', () => {
  withdrawCurrentCustomer();
  window.location.href = '../../create/signup/index.html';
});
