import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getBanners } from '../../../../shared/services/content-service.js';
import { createBannerRow } from '../../_shared/admin-content.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const banners = getBanners().sort((first, second) => (first.sortOrder ?? 1) - (second.sortOrder ?? 1));

document.getElementById('banner-list').innerHTML = banners.length
  ? banners.map((banner) => createBannerRow(banner, { basePath })).join('')
  : `
    <div class="empty-state">
      <p>등록된 홈 배너가 없습니다.</p>
      <a class="button button--primary" href="/src/admin/content/create/banner/index.html">배너 등록</a>
    </div>
  `;
