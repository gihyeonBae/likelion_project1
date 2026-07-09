import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { clearSession } from '../../../../shared/services/auth-service.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('account', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

document.getElementById('logout-button').addEventListener('click', () => {
  clearSession();
  window.location.href = '../../create/login/index.html';
});
