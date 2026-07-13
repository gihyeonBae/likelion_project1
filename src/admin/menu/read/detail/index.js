import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getCategories } from '../../../../shared/services/category-service.js';
import { getMenuById } from '../../../../shared/services/menu-service.js';
import { formatCurrency } from '../../../../shared/utils/format.js';
import { createMenuImage } from '../../../../shared/utils/image.js';
import { getCategoryLabel, getStatusLabel } from '../../_shared/admin-menu.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const menu = await getMenuById(new URLSearchParams(window.location.search).get('id'));
const categories = await getCategories();
const container = document.getElementById('admin-menu-detail');

container.innerHTML = menu
  ? `
    <article class="detail-layout">
      <div class="detail-visual menu-card--${menu.imageTone}">
        ${createMenuImage(menu, { basePath, className: 'detail-visual__photo', lazy: false })}
      </div>
      <div class="detail-content">
        <p class="eyebrow">${getCategoryLabel(categories, menu.categoryId)} · ${getStatusLabel(menu.status)}</p>
        <h1>${menu.nameKo}</h1>
        <p class="detail-content__en">${menu.nameEn}</p>
        <p class="hero__description">${menu.description}</p>
        <strong class="detail-price">${formatCurrency(menu.price)}</strong>
        <div class="menu-card__tags">${menu.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}</div>
        <dl class="info-list">
          <div><dt>추천</dt><dd>${menu.isRecommended ? '추천 메뉴' : '일반 메뉴'}</dd></div>
          <div><dt>옵션</dt><dd>${Object.entries(menu.options).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join('/') : value}`).join(', ')}</dd></div>
        </dl>
        <div class="detail-actions">
          <a class="button button--primary" href="../../update/index.html?id=${menu.id}">수정</a>
          <a class="button button--ghost" href="../../delete/index.html?id=${menu.id}">삭제</a>
          <a class="button button--ghost" href="../list/index.html">목록</a>
        </div>
      </div>
    </article>
  `
  : `
    <div class="empty-state">
      <p>메뉴를 찾을 수 없습니다.</p>
      <a class="button button--primary" href="../list/index.html">목록</a>
    </div>
  `;
