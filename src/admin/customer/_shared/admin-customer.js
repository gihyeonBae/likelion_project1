export function getCustomerStatusLabel(status) {
  const labels = {
    active: '활성',
    blocked: '정지',
    withdrawn: '탈퇴',
  };

  return labels[status] ?? status;
}

export function formatCustomerDate(value) {
  if (!value) {
    return '날짜 없음';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function createCustomerRow(customer, { basePath }) {
  return `
    <article class="order-card">
      <div>
        <p class="eyebrow">${getCustomerStatusLabel(customer.status)}</p>
        <h3>${customer.name}</h3>
        <p class="menu-card__meta">${customer.email} · ${customer.phone}</p>
      </div>
      <div class="cart-item__actions">
        <a class="button button--ghost" href="/src/admin/customer/read/detail/index.html?id=${customer.id}">상세</a>
        <a class="button button--ghost" href="/src/admin/customer/update/status/index.html?id=${customer.id}">상태</a>
      </div>
    </article>
  `;
}
