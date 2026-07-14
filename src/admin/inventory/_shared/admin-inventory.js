export function getInventoryStatusLabel(status) {
  const labels = {
    available: '정상',
    low: '부족',
    'sold-out': '품절',
  };

  return labels[status] ?? status;
}

export function getComputedInventoryStatus(item) {
  if (item.quantity <= 0 || item.status === 'sold-out') {
    return 'sold-out';
  }

  if (item.quantity <= item.safetyQuantity || item.status === 'low') {
    return 'low';
  }

  return 'available';
}

export function createInventoryForm({ item = {}, submitLabel }) {
  return `
    <form class="panel-form" id="inventory-form">
      <p class="eyebrow">Inventory</p>
      <h1>${item.id ? '재고 수정' : '재고 등록'}</h1>
      <label class="form-field">
        <span>재고명</span>
        <input type="text" name="name" value="${item.name ?? ''}" required />
      </label>
      <label class="form-field">
        <span>분류</span>
        <select name="category">
          ${['원두', '우유', '시럽', '디저트', '베이커리', '소모품'].map((category) => `<option value="${category}"${category === item.category ? ' selected' : ''}>${category}</option>`).join('')}
        </select>
      </label>
      <label class="form-field">
        <span>단위</span>
        <input type="text" name="unit" value="${item.unit ?? '개'}" required />
      </label>
      <label class="form-field">
        <span>현재 수량</span>
        <input type="number" name="quantity" value="${item.quantity ?? 0}" min="0" required />
      </label>
      <label class="form-field">
        <span>안전 재고</span>
        <input type="number" name="safetyQuantity" value="${item.safetyQuantity ?? 0}" min="0" required />
      </label>
      <label class="form-field">
        <span>상태</span>
        <select name="status">
          <option value="available"${item.status === 'available' || !item.status ? ' selected' : ''}>정상</option>
          <option value="low"${item.status === 'low' ? ' selected' : ''}>부족</option>
          <option value="sold-out"${item.status === 'sold-out' ? ' selected' : ''}>품절</option>
        </select>
      </label>
      <p class="form-error" id="form-error" role="alert"></p>
      <div class="detail-actions">
        <button class="button button--primary" type="submit">${submitLabel}</button>
        <a class="button button--ghost" href="/src/admin/inventory/read/list">목록</a>
      </div>
    </form>
  `;
}

export function getInventoryPayloadFromForm(form) {
  const formData = new FormData(form);

  return {
    name: String(formData.get('name')).trim(),
    category: formData.get('category'),
    unit: String(formData.get('unit')).trim(),
    quantity: Number(formData.get('quantity')),
    safetyQuantity: Number(formData.get('safetyQuantity')),
    status: formData.get('status'),
  };
}

export function createInventoryRow(item, { basePath }) {
  const status = getComputedInventoryStatus(item);

  return `
    <article class="order-card">
      <div>
        <p class="eyebrow">${item.category} · ${getInventoryStatusLabel(status)}</p>
        <h3>${item.name}</h3>
        <p class="menu-card__meta">현재 ${item.quantity}${item.unit} · 안전 재고 ${item.safetyQuantity}${item.unit}</p>
      </div>
      <div class="cart-item__actions">
        <a class="button button--ghost" href="/src/admin/inventory/update?id=${item.id}">수정</a>
        <a class="button button--ghost" href="/src/admin/inventory/read/history?id=${item.id}">입고 기록</a>
        <a class="button button--ghost" href="/src/admin/inventory/delete?id=${item.id}">삭제</a>
      </div>
    </article>
  `;
}
