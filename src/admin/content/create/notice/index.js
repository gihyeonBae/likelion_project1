import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { createNotice } from '../../../../shared/services/content-service.js';
import { isRequired } from '../../../../shared/utils/validation.js';
import { createNoticeForm, getNoticePayloadFromForm } from '../../_shared/admin-content.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();
document.getElementById('notice-create').innerHTML = createNoticeForm({ submitLabel: '공지 등록' });

document.getElementById('notice-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const payload = getNoticePayloadFromForm(event.currentTarget);
  const error = document.getElementById('form-error');

  if (![payload.title, payload.message].every(isRequired)) {
    error.textContent = '제목과 내용을 입력해 주세요.';
    return;
  }

  createNotice(payload);
  window.location.href = '../../read/notice-list/index.html';
});
