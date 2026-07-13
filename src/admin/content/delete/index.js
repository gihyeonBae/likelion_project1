import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { deleteBanner, getBannerById } from '../../../shared/services/content-service.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const content = getBannerById(id);
const listPath = '/src/admin/content/read/banner-list/index.html';

document.getElementById('content-delete').innerHTML = content
  ? `
    <section class="confirm-panel">
      <p class="eyebrow">Delete content</p>
      <h1>홈 배너 삭제</h1>
      <p class="hero__description">${content.title} 항목을 삭제합니다.</p>
      <div class="detail-actions">
        <button class="button button--primary" id="delete-content" type="button">삭제</button>
        <a class="button button--ghost" href="${listPath}">취소</a>
      </div>
    </section>
  `
  : `
    <div class="empty-state">
      <p>삭제할 콘텐츠를 찾을 수 없습니다.</p>
      <a class="button button--primary" href="${listPath}">목록</a>
    </div>
  `;

document.getElementById('delete-content')?.addEventListener('click', () => {
  deleteBanner(id);
  window.location.href = listPath;
});
