import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getCustomerById, updateCustomerStatus } from '../../../../shared/services/auth-service.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const customer = await getCustomerById(new URLSearchParams(window.location.search).get('id'));
const container = document.getElementById('customer-status');

if (!customer) {
  container.innerHTML = `
    <div class="empty-state">
      <p>상태를 수정할 고객을 찾을 수 없습니다.</p>
      <a class="button button--primary" href="/src/admin/customer/read/list/index.html">목록</a>
    </div>
  `;
} else {
  container.innerHTML = `
    <form class="panel-form" id="status-form">
      <p class="eyebrow">Customer status</p>
      <h1>${customer.name}</h1>
      <label class="form-field">
        <span>고객 상태</span>
        <select name="status">
          <option value="active"${customer.status === 'active' ? ' selected' : ''}>활성</option>
          <option value="blocked"${customer.status === 'blocked' ? ' selected' : ''}>정지</option>
          <option value="withdrawn"${customer.status === 'withdrawn' ? ' selected' : ''}>탈퇴</option>
        </select>
      </label>
      <div class="detail-actions">
        <button class="button button--primary" type="submit">상태 저장</button>
        <a class="button button--ghost" href="/src/admin/customer/read/detail/index.html?id=${customer.id}">취소</a>
      </div>
    </form>
  `;

  document.getElementById('status-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    await updateCustomerStatus(customer.id, new FormData(event.currentTarget).get('status'));
    window.location.href = `/src/admin/customer/read/detail/index.html?id=${customer.id}`;
  });
}
