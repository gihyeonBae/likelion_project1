import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { getCartItemById, updateCartItem } from '../../../shared/services/cart-service.js';
import { getMenuById } from '../../../shared/services/menu-service.js';
import { formatCurrency } from '../../../shared/utils/format.js';
import { createMenuImage } from '../../../shared/utils/image.js';

const basePath = '../../../..';

document.getElementById('app-header').innerHTML = renderHeader('cart', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const params = new URLSearchParams(window.location.search);
const cartItem = getCartItemById(params.get('id'));
const menu = cartItem ? await getMenuById(cartItem.menuId) : null;
const container = document.getElementById('cart-update');

function isSelected(optionValue, selectedValue) {
  return String(optionValue) === String(selectedValue) ? ' selected' : '';
}

function createOptionFields(menuItem, item) {
  const fields = [];

  if (menuItem.options.temperature) {
    fields.push(`
      <label class="form-field">
        <span>온도</span>
        <select name="temperature">
          ${menuItem.options.temperature.map((value) => `<option value="${value}"${isSelected(value, item.options.temperature)}>${value === 'ice' ? 'ICE' : 'HOT'}</option>`).join('')}
        </select>
      </label>
    `);
  }

  if (menuItem.options.size) {
    fields.push(`
      <label class="form-field">
        <span>사이즈</span>
        <select name="size">
          ${menuItem.options.size.map((value) => `<option value="${value}"${isSelected(value, item.options.size)}>${value === 'large' ? 'Large' : 'Regular'}</option>`).join('')}
        </select>
      </label>
    `);
  }

  if (menuItem.options.extraShot) {
    fields.push(`
      <label class="form-field">
        <span>샷 추가</span>
        <input type="number" name="extraShotCount" value="${item.options.extraShotCount ?? 0}" min="0" max="3" />
      </label>
    `);
  }

  if (menuItem.options.syrup) {
    fields.push(`
      <label class="form-field">
        <span>시럽 추가</span>
        <input type="number" name="syrupCount" value="${item.options.syrupCount ?? 0}" min="0" max="3" />
      </label>
    `);
  }

  fields.push(`
    <label class="form-field">
      <span>이용 방식</span>
      <select name="takeout">
        <option value="true"${isSelected(true, item.options.takeout)}>포장</option>
        <option value="false"${isSelected(false, item.options.takeout)}>매장</option>
      </select>
    </label>
  `);

  return fields.join('');
}

if (!cartItem || !menu) {
  container.innerHTML = `
    <div class="empty-state">
      <p>수정할 장바구니 메뉴를 찾을 수 없습니다.</p>
      <a class="button button--primary" href="../read/index.html">장바구니로 이동</a>
    </div>
  `;
} else {
  container.innerHTML = `
    <article class="cart-form-layout">
      <div class="detail-visual menu-card--${menu.imageTone}">
        ${createMenuImage(menu, { basePath, className: 'detail-visual__photo', lazy: false })}
      </div>
      <form class="panel-form" id="cart-update-form">
        <p class="eyebrow">Update cart</p>
        <h1>${menu.nameKo}</h1>
        <p class="hero__description">${menu.description}</p>
        <strong class="detail-price">${formatCurrency(menu.price)}</strong>
        <label class="form-field">
          <span>수량</span>
          <input type="number" name="quantity" value="${cartItem.quantity}" min="1" max="20" required />
        </label>
        ${createOptionFields(menu, cartItem)}
        <div class="detail-actions">
          <button class="button button--primary" type="submit">변경사항 저장</button>
          <a class="button button--ghost" href="../read/index.html">취소</a>
        </div>
      </form>
    </article>
  `;

  document.getElementById('cart-update-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    updateCartItem(cartItem.id, {
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
