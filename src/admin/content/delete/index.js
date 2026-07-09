import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { deleteBanner, deleteNotice, getBannerById, getNoticeById } from '../../../shared/services/content-service.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const params = new URLSearchParams(window.location.search);
const type = params.get('type');
const id = params.get('id');
const content = type === 'notice' ? getNoticeById(id) : getBannerById(id);
const listPath = type === 'notice' ? '../read/notice-list/index.html' : '../read/banner-list/index.html';
const label = type === 'notice' ? '공지사항' : '홈 배너';

document.getElementById('content-delete').innerHTML = content
  ? `
    <section class="confirm-panel">
      <p class="eyebrow">Delete content</p>
      <h1>${label} 삭제</h1>
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
  if (type === 'notice') {
    deleteNotice(id);
  } else {
    deleteBanner(id);
  }

  window.location.href = listPath;
});
