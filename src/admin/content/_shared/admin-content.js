export function formatContentDate(value) {
  if (!value) {
    return '날짜 없음';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function createBannerForm({ banner = {}, submitLabel }) {
  return `
    <form class="panel-form" id="banner-form">
      <p class="eyebrow">Home banner</p>
      <h1>${banner.id ? '홈 배너 수정' : '홈 배너 등록'}</h1>
      <label class="form-field">
        <span>제목</span>
        <input type="text" name="title" value="${banner.title ?? ''}" required />
      </label>
      <label class="form-field">
        <span>설명</span>
        <textarea name="description" rows="4" required>${banner.description ?? ''}</textarea>
      </label>
      <label class="form-field">
        <span>버튼 문구</span>
        <input type="text" name="linkLabel" value="${banner.linkLabel ?? '메뉴 보기'}" />
      </label>
      <label class="form-field">
        <span>버튼 링크</span>
        <input type="text" name="linkUrl" value="${banner.linkUrl ?? './src/customer/menu/read/list/index.html'}" />
      </label>
      <label class="form-field">
        <span>노출 순서</span>
        <input type="number" name="sortOrder" value="${banner.sortOrder ?? 1}" min="1" />
      </label>
      <div class="form-checks">
        <label><input type="checkbox" name="isVisible"${banner.isVisible ?? true ? ' checked' : ''} /> 홈에 노출</label>
      </div>
      <p class="form-error" id="form-error" role="alert"></p>
      <div class="detail-actions">
        <button class="button button--primary" type="submit">${submitLabel}</button>
        <a class="button button--ghost" href="../../read/banner-list/index.html">목록</a>
      </div>
    </form>
  `;
}

export function getBannerPayloadFromForm(form) {
  const formData = new FormData(form);

  return {
    title: String(formData.get('title')).trim(),
    description: String(formData.get('description')).trim(),
    linkLabel: String(formData.get('linkLabel')).trim(),
    linkUrl: String(formData.get('linkUrl')).trim(),
    sortOrder: Number(formData.get('sortOrder')),
    isVisible: Boolean(formData.get('isVisible')),
  };
}

export function createNoticeForm({ notice = {}, submitLabel }) {
  return `
    <form class="panel-form" id="notice-form">
      <p class="eyebrow">Notice</p>
      <h1>${notice.id ? '공지사항 수정' : '공지사항 등록'}</h1>
      <label class="form-field">
        <span>유형</span>
        <select name="category">
          ${['공지', '이벤트', '운영', '메뉴'].map((category) => `<option value="${category}"${category === notice.category ? ' selected' : ''}>${category}</option>`).join('')}
        </select>
      </label>
      <label class="form-field">
        <span>제목</span>
        <input type="text" name="title" value="${notice.title ?? ''}" required />
      </label>
      <label class="form-field">
        <span>내용</span>
        <textarea name="message" rows="8" required>${notice.message ?? ''}</textarea>
      </label>
      <div class="form-checks">
        <label><input type="checkbox" name="isPinned"${notice.isPinned ? ' checked' : ''} /> 상단 고정</label>
        <label><input type="checkbox" name="isVisible"${notice.isVisible ?? true ? ' checked' : ''} /> 노출</label>
      </div>
      <p class="form-error" id="form-error" role="alert"></p>
      <div class="detail-actions">
        <button class="button button--primary" type="submit">${submitLabel}</button>
        <a class="button button--ghost" href="../../read/notice-list/index.html">목록</a>
      </div>
    </form>
  `;
}

export function getNoticePayloadFromForm(form) {
  const formData = new FormData(form);

  return {
    category: formData.get('category'),
    title: String(formData.get('title')).trim(),
    message: String(formData.get('message')).trim(),
    isPinned: Boolean(formData.get('isPinned')),
    isVisible: Boolean(formData.get('isVisible')),
  };
}

export function createBannerRow(banner, { basePath }) {
  return `
    <article class="order-card">
      <div>
        <p class="eyebrow">${banner.isVisible ? '노출' : '숨김'} · 순서 ${banner.sortOrder ?? 1}</p>
        <h3>${banner.title}</h3>
        <p class="menu-card__meta">${banner.description}</p>
      </div>
      <div class="cart-item__actions">
        <a class="button button--ghost" href="${basePath}/src/admin/content/update/banner/index.html?id=${banner.id}">수정</a>
        <a class="button button--ghost" href="${basePath}/src/admin/content/delete/index.html?type=banner&id=${banner.id}">삭제</a>
      </div>
    </article>
  `;
}

export function createNoticeRow(notice, { basePath }) {
  return `
    <article class="order-card">
      <div>
        <p class="eyebrow">${notice.category} · ${notice.isVisible ? '노출' : '숨김'}${notice.isPinned ? ' · 고정' : ''}</p>
        <h3>${notice.title}</h3>
        <p class="menu-card__meta">${formatContentDate(notice.createdAt)}</p>
      </div>
      <div class="cart-item__actions">
        <a class="button button--ghost" href="${basePath}/src/admin/content/update/notice/index.html?id=${notice.id}">수정</a>
        <a class="button button--ghost" href="${basePath}/src/admin/content/delete/index.html?type=notice&id=${notice.id}">삭제</a>
      </div>
    </article>
  `;
}
