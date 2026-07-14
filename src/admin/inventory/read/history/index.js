import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { addInventoryHistory, getInventoryItemById } from '../../../../shared/services/inventory-service.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const item = getInventoryItemById(new URLSearchParams(window.location.search).get('id'));
const container = document.getElementById('inventory-history');

if (!item) {
  container.innerHTML = `
    <div class="empty-state">
      <p>입고 기록을 확인할 재고를 찾을 수 없습니다.</p>
      <a class="button button--primary" href="/src/admin/inventory/read/list">목록</a>
    </div>
  `;
} else {
  container.innerHTML = `
    <section class="confirm-panel">
      <p class="eyebrow">${item.category}</p>
      <h1>${item.name}</h1>
      <p class="hero__description">현재 ${item.quantity}${item.unit} · 안전 재고 ${item.safetyQuantity}${item.unit}</p>
      <form class="panel-form" id="history-form">
        <h2>입고/차감 기록 추가</h2>
        <label class="form-field">
          <span>유형</span>
          <select name="type">
            <option value="입고">입고</option>
            <option value="사용">사용</option>
            <option value="조정">조정</option>
          </select>
        </label>
        <label class="form-field">
          <span>수량 변화</span>
          <input type="number" name="quantityChange" value="1" required />
        </label>
        <label class="form-field">
          <span>메모</span>
          <input type="text" name="memo" placeholder="우유 12팩 입고" />
        </label>
        <button class="button button--primary" type="submit">기록 추가</button>
      </form>
      <div class="order-list">
        ${(item.histories ?? []).length ? item.histories.map((history) => `
          <article class="order-card">
            <div>
              <p class="eyebrow">${history.type}</p>
              <h3>${history.quantityChange > 0 ? '+' : ''}${history.quantityChange}${item.unit}</h3>
              <p class="menu-card__meta">${history.memo || '메모 없음'} · ${new Date(history.createdAt).toLocaleString('ko-KR')}</p>
            </div>
          </article>
        `).join('') : '<p class="empty-state">아직 기록이 없습니다.</p>'}
      </div>
      <div class="detail-actions">
        <a class="button button--ghost" href="/src/admin/inventory/read/list">목록</a>
      </div>
    </section>
  `;

  document.getElementById('history-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    addInventoryHistory(item.id, {
      type: formData.get('type'),
      quantityChange: Number(formData.get('quantityChange')),
      memo: formData.get('memo'),
    });
    window.location.reload();
  });
}
