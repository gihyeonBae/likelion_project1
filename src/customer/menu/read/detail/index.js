import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getCategories } from '../../../../shared/services/category-service.js';
import { getMenus } from '../../../../shared/services/menu-service.js';
import { formatCurrency } from '../../../../shared/utils/format.js';
import { createMenuImage } from '../../../../shared/utils/image.js';
import { getMenuCategoryLabel } from '../../_shared/menu-filter.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('menu', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const params = new URLSearchParams(window.location.search);
const menuId = params.get('id');
const menus = await getMenus();
const menu = menus.find((item) => item.id === menuId) || menus[0];
const categories = await getCategories();
const detail = document.getElementById('menu-detail');

function createOptionList(options) {
  const optionLabels = [];

  if (options.temperature) {
    optionLabels.push(`온도: ${options.temperature.join(' / ')}`);
  }

  if (options.size) {
    optionLabels.push(`사이즈: ${options.size.join(' / ')}`);
  }

  if (options.extraShot) {
    optionLabels.push('샷 추가 가능');
  }

  if (options.syrup) {
    optionLabels.push('시럽 추가 가능');
  }

  if (options.takeout) {
    optionLabels.push('포장 가능');
  }

  return optionLabels.map((label) => `<span class="tag">${label}</span>`).join('');
}

if (!menu) {
  detail.innerHTML = `
    <div class="empty-state">
      <p>메뉴를 찾을 수 없습니다.</p>
      <a class="button button--primary" href="../list/index.html">메뉴 목록</a>
    </div>
  `;
} else {
  detail.innerHTML = `
    <article class="detail-layout">
      <div class="detail-visual menu-card--${menu.imageTone}">
        ${createMenuImage(menu, { basePath, className: 'detail-visual__photo', lazy: false })}
      </div>
      <div class="detail-content">
        <p class="eyebrow">${getMenuCategoryLabel(categories, menu)}</p>
        <h1>${menu.nameKo}</h1>
        <p class="detail-content__en">${menu.nameEn}</p>
        <p class="hero__description">${menu.description}</p>
        <strong class="detail-price">${formatCurrency(menu.price)}</strong>
        <div class="menu-card__tags">${menu.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}</div>
        <div class="option-panel">
          <h2>선택 옵션</h2>
          <div class="menu-card__tags">${createOptionList(menu.options)}</div>
        </div>
        <div class="detail-actions">
          <a class="button button--primary" href="${basePath}/src/customer/cart/create/index.html?id=${menu.id}">장바구니 담기</a>
          <a class="button button--ghost" href="${basePath}/src/customer/menu/read/list/index.html?category=${menu.categoryId}">같은 카테고리 보기</a>
        </div>
      </div>
    </article>
  `;
}
