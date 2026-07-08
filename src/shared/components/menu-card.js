import { formatCurrency } from '../utils/format.js';

export function createMenuCard(menu) {
  const tags = menu.tags.map((tag) => `<span class="tag">${tag}</span>`).join('');
  const statusLabel = menu.status === 'sold-out' ? '품절' : '주문 가능';

  return `
    <article class="menu-card">
      <div class="menu-card__image" role="img" aria-label="${menu.nameKo} 이미지 영역">
        ${menu.nameEn}
      </div>
      <div class="menu-card__body">
        <div class="menu-card__name">
          <h3>${menu.nameKo}</h3>
          <span class="menu-card__price">${formatCurrency(menu.price)}</span>
        </div>
        <p class="menu-card__meta">${menu.nameEn} · ${statusLabel}</p>
        <p>${menu.description}</p>
        <div class="menu-card__tags">${tags}</div>
      </div>
    </article>
  `;
}
