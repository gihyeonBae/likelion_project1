export function getInquiryStatusLabel(status) {
  const labels = {
    waiting: '답변 대기',
    answered: '답변 완료',
  };

  return labels[status] ?? status;
}

export function formatInquiryDate(value) {
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function createInquiryCard(inquiry, { basePath }) {
  return `
    <article class="order-card">
      <div>
        <p class="eyebrow">${getInquiryStatusLabel(inquiry.status)}</p>
        <h3>${inquiry.title}</h3>
        <p class="menu-card__meta">${inquiry.category} · ${formatInquiryDate(inquiry.createdAt)}</p>
      </div>
      <a class="button button--ghost" href="${basePath}/src/customer/inquiry/read/detail/index.html?id=${inquiry.id}">상세</a>
    </article>
  `;
}
