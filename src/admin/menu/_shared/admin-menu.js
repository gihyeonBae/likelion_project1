import { formatCurrency } from '../../../shared/utils/format.js';

export const IMAGE_TONES = [
  { value: 'coffee', label: 'Coffee' },
  { value: 'latte', label: 'Latte' },
  { value: 'matcha', label: 'Matcha' },
  { value: 'ade', label: 'Ade' },
  { value: 'dessert', label: 'Dessert' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'season', label: 'Season' },
];

export function getCategoryLabel(categories, categoryId) {
  return categories.find((category) => category.id === categoryId)?.nameKo ?? '미분류';
}

export function getStatusLabel(status) {
  return status === 'sold-out' ? '품절' : '판매중';
}

function isSelected(value, selectedValue) {
  return value === selectedValue ? ' selected' : '';
}

function isChecked(value) {
  return value ? ' checked' : '';
}

export function createMenuForm({ menu = {}, categories, submitLabel }) {
  const options = menu.options ?? {};
  const temperatures = options.temperature ?? ['hot', 'ice'];
  const sizes = options.size ?? ['regular'];

  return `
    <form class="panel-form" id="menu-form">
      <p class="eyebrow">Admin menu</p>
      <h1>${menu.id ? '메뉴 수정' : '메뉴 등록'}</h1>
      <label class="form-field">
        <span>카테고리</span>
        <select name="categoryId" required>
          ${categories.map((category) => `<option value="${category.id}"${isSelected(category.id, menu.categoryId)}>${category.nameKo}</option>`).join('')}
        </select>
      </label>
      <label class="form-field">
        <span>국문 메뉴명</span>
        <input type="text" name="nameKo" value="${menu.nameKo ?? ''}" required />
      </label>
      <label class="form-field">
        <span>영문 메뉴명</span>
        <input type="text" name="nameEn" value="${menu.nameEn ?? ''}" required />
      </label>
      <label class="form-field">
        <span>설명</span>
        <textarea name="description" rows="4" required>${menu.description ?? ''}</textarea>
      </label>
      <label class="form-field">
        <span>가격</span>
        <input type="number" name="price" value="${menu.price ?? 4500}" min="0" step="100" required />
      </label>
      <label class="form-field">
        <span>이미지 톤</span>
        <select name="imageTone">
          ${IMAGE_TONES.map((tone) => `<option value="${tone.value}"${isSelected(tone.value, menu.imageTone ?? 'coffee')}>${tone.label}</option>`).join('')}
        </select>
      </label>
      <label class="form-field">
        <span>태그</span>
        <input type="text" name="tags" value="${(menu.tags ?? []).join(', ')}" placeholder="best, sweet" />
      </label>
      <label class="form-field">
        <span>판매 상태</span>
        <select name="status">
          <option value="on-sale"${isSelected('on-sale', menu.status ?? 'on-sale')}>판매중</option>
          <option value="sold-out"${isSelected('sold-out', menu.status)}>품절</option>
        </select>
      </label>
      <div class="form-checks">
        <label><input type="checkbox" name="isRecommended"${isChecked(menu.isRecommended)} /> 추천 메뉴</label>
        <label><input type="checkbox" name="temperatureHot"${isChecked(temperatures.includes('hot'))} /> HOT</label>
        <label><input type="checkbox" name="temperatureIce"${isChecked(temperatures.includes('ice'))} /> ICE</label>
        <label><input type="checkbox" name="sizeRegular"${isChecked(sizes.includes('regular'))} /> Regular</label>
        <label><input type="checkbox" name="sizeLarge"${isChecked(sizes.includes('large'))} /> Large</label>
        <label><input type="checkbox" name="extraShot"${isChecked(options.extraShot)} /> 샷 추가 가능</label>
        <label><input type="checkbox" name="syrup"${isChecked(options.syrup)} /> 시럽 추가 가능</label>
        <label><input type="checkbox" name="takeout"${isChecked(options.takeout ?? true)} /> 포장 가능</label>
      </div>
      <p class="form-error" id="form-error" role="alert"></p>
      <div class="detail-actions">
        <button class="button button--primary" type="submit">${submitLabel}</button>
        <a class="button button--ghost" href="../read/list/index.html">목록</a>
      </div>
    </form>
  `;
}

export function getMenuPayloadFromForm(form) {
  const formData = new FormData(form);
  const temperature = [];
  const size = [];

  if (formData.get('temperatureHot')) {
    temperature.push('hot');
  }

  if (formData.get('temperatureIce')) {
    temperature.push('ice');
  }

  if (formData.get('sizeRegular')) {
    size.push('regular');
  }

  if (formData.get('sizeLarge')) {
    size.push('large');
  }

  return {
    nameKo: formData.get('nameKo').trim(),
    nameEn: formData.get('nameEn').trim(),
    categoryId: formData.get('categoryId'),
    description: formData.get('description').trim(),
    price: Number(formData.get('price')),
    imageUrl: `./assets/images/menu/${formData.get('nameEn').trim().toLowerCase().replace(/\s+/g, '-')}.jpg`,
    imageTone: formData.get('imageTone'),
    tags: String(formData.get('tags') ?? '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    options: {
      ...(temperature.length ? { temperature } : {}),
      ...(size.length ? { size } : {}),
      extraShot: Boolean(formData.get('extraShot')),
      syrup: Boolean(formData.get('syrup')),
      takeout: Boolean(formData.get('takeout')),
    },
    status: formData.get('status'),
    isRecommended: Boolean(formData.get('isRecommended')),
  };
}

export function createAdminMenuRow(menu, categories, { basePath }) {
  return `
    <article class="order-card">
      <div>
        <p class="eyebrow">${getCategoryLabel(categories, menu.categoryId)} · ${getStatusLabel(menu.status)}</p>
        <h3>${menu.nameKo}</h3>
        <p class="menu-card__meta">${menu.nameEn} · ${menu.tags.join(', ') || '태그 없음'}</p>
      </div>
      <strong>${formatCurrency(menu.price)}</strong>
      <div class="cart-item__actions">
        <a class="button button--ghost" href="${basePath}/src/admin/menu/read/detail/index.html?id=${menu.id}">상세</a>
        <a class="button button--ghost" href="${basePath}/src/admin/menu/update/index.html?id=${menu.id}">수정</a>
        <a class="button button--ghost" href="${basePath}/src/admin/menu/delete/index.html?id=${menu.id}">삭제</a>
      </div>
    </article>
  `;
}
