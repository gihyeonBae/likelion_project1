const NAV_ITEMS = [
  { id: 'home', label: '홈', href: 'src/customer/home/read' },
  { id: 'menu', label: '메뉴', href: 'src/customer/menu/read/list' },
  { id: 'cart', label: '장바구니', href: 'src/customer/cart/read' },
  { id: 'order', label: '주문내역', href: 'src/customer/order/read/list' },
  { id: 'account', label: '내 정보', href: 'src/customer/account/read/profile' },
  { id: 'admin', label: '관리자', href: 'src/admin/dashboard/read' },
];

export function renderHeader(activeId = 'home', basePath = '.') {
  const navLinks = NAV_ITEMS.map((item) => {
    const current = item.id === activeId ? ' aria-current="page"' : '';
    return `<a href="/${item.href}"${current}>${item.label}</a>`;
  }).join('');

  return `
    <header class="site-header">
      <div class="site-header__inner">
        <a class="brand" href="/" aria-label="gh cafe 홈">
          <span class="brand__mark">GH</span>
          <span>gh cafe</span>
        </a>
        <nav class="site-nav" aria-label="주요 메뉴">
          ${navLinks}
        </nav>
      </div>
    </header>
  `;
}
