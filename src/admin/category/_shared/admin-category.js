export function createCategoryForm({ category = {}, submitLabel }) {
  return `
    <form class="panel-form" id="category-form">
      <p class="eyebrow">Admin category</p>
      <h1>${category.id ? '카테고리 수정' : '카테고리 등록'}</h1>
      <label class="form-field">
        <span>카테고리 ID</span>
        <input type="text" name="id" value="${category.id ?? ''}" ${category.id ? 'readonly' : ''} placeholder="coffee" required />
      </label>
      <label class="form-field">
        <span>국문명</span>
        <input type="text" name="nameKo" value="${category.nameKo ?? ''}" required />
      </label>
      <label class="form-field">
        <span>영문명</span>
        <input type="text" name="nameEn" value="${category.nameEn ?? ''}" required />
      </label>
      <label class="form-field">
        <span>설명</span>
        <textarea name="description" rows="4" required>${category.description ?? ''}</textarea>
      </label>
      <label class="form-field">
        <span>노출 순서</span>
        <input type="number" name="sortOrder" value="${category.sortOrder ?? 1}" min="1" required />
      </label>
      <div class="form-checks">
        <label><input type="checkbox" name="isVisible"${category.isVisible ?? true ? ' checked' : ''} /> 고객 화면에 노출</label>
      </div>
      <p class="form-error" id="form-error" role="alert"></p>
      <div class="detail-actions">
        <button class="button button--primary" type="submit">${submitLabel}</button>
        <a class="button button--ghost" href="../read/index.html">목록</a>
      </div>
    </form>
  `;
}

export function getCategoryPayloadFromForm(form) {
  const formData = new FormData(form);

  return {
    id: String(formData.get('id')).trim(),
    nameKo: String(formData.get('nameKo')).trim(),
    nameEn: String(formData.get('nameEn')).trim(),
    description: String(formData.get('description')).trim(),
    sortOrder: Number(formData.get('sortOrder')),
    isVisible: Boolean(formData.get('isVisible')),
  };
}

export function createAdminCategoryRow(category, menuCount, { basePath }) {
  return `
    <article class="order-card">
      <div>
        <p class="eyebrow">${category.id} · ${category.isVisible ? '노출' : '숨김'}</p>
        <h3>${category.nameKo}</h3>
        <p class="menu-card__meta">${category.nameEn} · 메뉴 ${menuCount}개 · 순서 ${category.sortOrder}</p>
      </div>
      <div class="cart-item__actions">
        <a class="button button--ghost" href="${basePath}/src/admin/category/update/index.html?id=${category.id}">수정</a>
        <a class="button button--ghost" href="${basePath}/src/admin/category/delete/index.html?id=${category.id}">삭제</a>
      </div>
    </article>
  `;
}
