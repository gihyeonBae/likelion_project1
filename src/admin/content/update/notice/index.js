import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getNoticeById, updateNotice } from '../../../../shared/services/content-service.js';
import { isRequired } from '../../../../shared/utils/validation.js';
import { createNoticeForm, getNoticePayloadFromForm } from '../../_shared/admin-content.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const notice = getNoticeById(new URLSearchParams(window.location.search).get('id'));
const container = document.getElementById('notice-update');

if (!notice) {
  container.innerHTML = `
    <div class="empty-state">
      <p>수정할 공지를 찾을 수 없습니다.</p>
      <a class="button button--primary" href="../../read/notice-list/index.html">목록</a>
    </div>
  `;
} else {
  container.innerHTML = createNoticeForm({ notice, submitLabel: '수정 저장' });
  document.getElementById('notice-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const payload = getNoticePayloadFromForm(event.currentTarget);
    const error = document.getElementById('form-error');

    if (![payload.title, payload.message].every(isRequired)) {
      error.textContent = '제목과 내용을 입력해 주세요.';
      return;
    }

    updateNotice(notice.id, payload);
    window.location.href = '../../read/notice-list/index.html';
  });
}
