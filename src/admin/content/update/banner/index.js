import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getBannerById, updateBanner } from '../../../../shared/services/content-service.js';
import { isRequired } from '../../../../shared/utils/validation.js';
import { createBannerForm, getBannerPayloadFromForm } from '../../_shared/admin-content.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const banner = getBannerById(new URLSearchParams(window.location.search).get('id'));
const container = document.getElementById('banner-update');

if (!banner) {
  container.innerHTML = `
    <div class="empty-state">
      <p>수정할 배너를 찾을 수 없습니다.</p>
      <a class="button button--primary" href="/src/admin/content/read/banner-list/index.html">목록</a>
    </div>
  `;
} else {
  container.innerHTML = createBannerForm({ banner, submitLabel: '수정 저장' });
  document.getElementById('banner-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const payload = getBannerPayloadFromForm(event.currentTarget);
    const error = document.getElementById('form-error');

    if (![payload.title, payload.description].every(isRequired)) {
      error.textContent = '제목과 설명을 입력해 주세요.';
      return;
    }

    updateBanner(banner.id, payload);
    window.location.href = '/src/admin/content/read/banner-list/index.html';
  });
}
