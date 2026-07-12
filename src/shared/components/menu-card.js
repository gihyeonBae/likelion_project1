import { formatCurrency } from '../utils/format.js';
import { createMenuImage } from '../utils/image.js';

export function createMenuCard(menu, options = {}) {
  const tags = menu.tags.map((tag) => `<span class="tag">${tag}</span>`).join('');
  const statusLabel = menu.status === 'sold-out' ? '품절' : '주문 가능';
  const detailHref = options.detailHref ?? '#';
  const actionLabel = menu.status === 'sold-out' ? '자세히 보기' : '메뉴 보기';
  const image = createMenuImage(menu, { basePath: options.basePath ?? '.', className: 'menu-card__photo' });

  return `
    <article class="menu-card menu-card--${menu.imageTone ?? 'coffee'}">
      <a class="menu-card__link" href="${detailHref}">
        <div class="menu-card__image" role="img" aria-label="${menu.nameKo} 이미지 영역">
          ${image}
        </div>
        <div class="menu-card__body">
          <div class="menu-card__name">
            <h3>${menu.nameKo}</h3>
            <span class="menu-card__price">${formatCurrency(menu.price)}</span>
          </div>
          <p class="menu-card__meta">${menu.nameEn} · ${statusLabel}</p>
          <p>${menu.description}</p>
          <div class="menu-card__tags">${tags}</div>
          <span class="menu-card__action">${actionLabel}</span>
        </div>
      </a>
    </article>
  `;
}
