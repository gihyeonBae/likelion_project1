export function createModal({ title, body, actionLabel = '확인' }) {
  return `
    <section class="modal" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="modal__panel">
        <h2>${title}</h2>
        <div>${body}</div>
        <button type="button">${actionLabel}</button>
      </div>
    </section>
  `;
}
