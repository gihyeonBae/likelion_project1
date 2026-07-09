import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getNotices } from '../../../../shared/services/content-service.js';
import { createNoticeRow } from '../../_shared/admin-content.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const notices = getNotices().sort((first, second) => Number(second.isPinned) - Number(first.isPinned));

document.getElementById('notice-list').innerHTML = notices.length
  ? notices.map((notice) => createNoticeRow(notice, { basePath })).join('')
  : `
    <div class="empty-state">
      <p>등록된 공지사항이 없습니다.</p>
      <a class="button button--primary" href="../../create/notice/index.html">공지 등록</a>
    </div>
  `;
