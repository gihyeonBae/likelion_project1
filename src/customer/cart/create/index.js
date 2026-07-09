import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { addCartItem } from '../../../shared/services/cart-service.js';
import { getMenuById } from '../../../shared/services/menu-service.js';
import { formatCurrency } from '../../../shared/utils/format.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('cart', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const params = new URLSearchParams(window.location.search);
const menu = getMenuById(params.get('id'));
const container = document.getElementById('cart-create');

function createOptionFields(menuItem) {
  const fields = [];

  if (menuItem.options.temperature) {
    fields.push(`
      <label class="form-field">
        <span>온도</span>
        <select name="temperature">
          ${menuItem.options.temperature.map((value) => `<option value="${value}">${value === 'ice' ? 'ICE' : 'HOT'}</option>`).join('')}
        </select>
      </label>
    `);
  }

  if (menuItem.options.size) {
    fields.push(`
      <label class="form-field">
        <span>사이즈</span>
        <select name="size">
          ${menuItem.options.size.map((value) => `<option value="${value}">${value === 'large' ? 'Large' : 'Regular'}</option>`).join('')}
        </select>
      </label>
    `);
  }

  if (menuItem.options.extraShot) {
    fields.push(`
      <label class="form-field">
        <span>샷 추가</span>
        <input type="number" name="extraShotCount" value="0" min="0" max="3" />
      </label>
    `);
  }

  if (menuItem.options.syrup) {
    fields.push(`
      <label class="form-field">
        <span>시럽 추가</span>
        <input type="number" name="syrupCount" value="0" min="0" max="3" />
      </label>
    `);
  }

  fields.push(`
    <label class="form-field">
      <span>이용 방식</span>
      <select name="takeout">
        <option value="true">포장</option>
        <option value="false">매장</option>
      </select>
    </label>
  `);

  return fields.join('');
}

if (!menu) {
  container.innerHTML = `
    <div class="empty-state">
      <p>메뉴를 찾을 수 없습니다.</p>
      <a class="button button--primary" href="../read/index.html">장바구니로 이동</a>
    </div>
  `;
} else if (menu.status === 'sold-out') {
  container.innerHTML = `
    <div class="empty-state">
      <p>${menu.nameKo}는 현재 품절입니다.</p>
      <a class="button button--primary" href="../../menu/read/list/index.html">다른 메뉴 보기</a>
    </div>
  `;
} else {
  container.innerHTML = `
    <article class="cart-form-layout">
      <div class="detail-visual menu-card--${menu.imageTone}">
        <span>${menu.nameEn}</span>
      </div>
      <form class="panel-form" id="cart-form">
        <p class="eyebrow">Add to cart</p>
        <h1>${menu.nameKo}</h1>
        <p class="hero__description">${menu.description}</p>
        <strong class="detail-price">${formatCurrency(menu.price)}</strong>
        <label class="form-field">
          <span>수량</span>
          <input type="number" name="quantity" value="1" min="1" max="20" required />
        </label>
        ${createOptionFields(menu)}
        <div class="detail-actions">
          <button class="button button--primary" type="submit">장바구니에 담기</button>
          <a class="button button--ghost" href="../../menu/read/detail/index.html?id=${menu.id}">상세로 돌아가기</a>
        </div>
      </form>
    </article>
  `;

  document.getElementById('cart-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    addCartItem({
      menuId: menu.id,
      quantity: formData.get('quantity'),
      options: {
        temperature: formData.get('temperature') || undefined,
        size: formData.get('size') || undefined,
        extraShotCount: Number(formData.get('extraShotCount') || 0),
        syrupCount: Number(formData.get('syrupCount') || 0),
        takeout: formData.get('takeout') === 'true',
      },
    });
    window.location.href = '../read/index.html';
  });
}
