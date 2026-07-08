const NAV_ITEMS = [
  { id: 'home', label: '홈', href: 'src/customer/home/read/index.html' },
  { id: 'menu', label: '메뉴', href: 'src/customer/menu/read/list/index.html' },
  { id: 'cart', label: '장바구니', href: 'src/customer/cart/read/index.html' },
  { id: 'order', label: '주문내역', href: 'src/customer/order/read/list/index.html' },
  { id: 'admin', label: '관리자', href: 'src/admin/dashboard/read/index.html' },
];

export function renderHeader(activeId = 'home', basePath = '.') {
  const navLinks = NAV_ITEMS.map((item) => {
    const current = item.id === activeId ? ' aria-current="page"' : '';
    return `<a href="${basePath}/${item.href}"${current}>${item.label}</a>`;
  }).join('');

  return `
    <header class="site-header">
      <div class="site-header__inner">
        <a class="brand" href="${basePath}/index.html" aria-label="Libre Cafe 홈">
          <span class="brand__mark">L</span>
          <span>Libre Cafe</span>
        </a>
        <nav class="site-nav" aria-label="주요 메뉴">
          ${navLinks}
        </nav>
      </div>
    </header>
  `;
}
