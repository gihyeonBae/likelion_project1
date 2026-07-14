import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { createBanner } from '../../../../shared/services/content-service.js';
import { isRequired } from '../../../../shared/utils/validation.js';
import { createBannerForm, getBannerPayloadFromForm } from '../../_shared/admin-content.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();
document.getElementById('banner-create').innerHTML = createBannerForm({ submitLabel: '배너 등록' });

document.getElementById('banner-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const payload = getBannerPayloadFromForm(event.currentTarget);
  const error = document.getElementById('form-error');

  if (![payload.title, payload.description].every(isRequired)) {
    error.textContent = '제목과 설명을 입력해 주세요.';
    return;
  }

  createBanner(payload);
  window.location.href = '/src/admin/content/read/banner-list';
});
