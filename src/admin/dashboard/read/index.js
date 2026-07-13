import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { getCategories } from '../../../shared/services/category-service.js';
import { getMenus } from '../../../shared/services/menu-service.js';
import { getOrders } from '../../../shared/services/order-service.js';
import { getCustomers } from '../../../shared/services/auth-service.js';

document.getElementById('app-header').innerHTML = renderHeader('admin', '../../../..');
document.getElementById('app-footer').innerHTML = renderFooter();

const menus = await getMenus();
const categories = await getCategories();
const orders = await getOrders();
const customers = await getCustomers();

document.getElementById('admin-summary').innerHTML = `
  <a class="category-card" href="../../menu/read/list/index.html">
    <p>Menus</p>
    <h3>${menus.length}개 메뉴</h3>
    <span>판매중 ${menus.filter((menu) => menu.status === 'on-sale').length}개 · 품절 ${menus.filter((menu) => menu.status === 'sold-out').length}개</span>
  </a>
  <a class="category-card" href="../../category/read/index.html">
    <p>Categories</p>
    <h3>${categories.length}개 카테고리</h3>
    <span>노출 ${categories.filter((category) => category.isVisible).length}개 · 숨김 ${categories.filter((category) => !category.isVisible).length}개</span>
  </a>
  <a class="category-card" href="../../menu/create/index.html">
    <p>Create</p>
    <h3>메뉴 등록</h3>
    <span>신규 커피, 음료, 디저트, 베이커리 메뉴를 추가합니다.</span>
  </a>
  <a class="category-card" href="../../order/read/list/index.html">
    <p>Orders</p>
    <h3>${orders.length}건 주문</h3>
    <span>진행중 ${orders.filter((order) => !['complete', 'canceled'].includes(order.status)).length}건 · 완료 ${orders.filter((order) => order.status === 'complete').length}건</span>
  </a>
  <a class="category-card" href="../../customer/read/list/index.html">
    <p>Customers</p>
    <h3>${customers.length}명 고객</h3>
    <span>활성 ${customers.filter((customer) => customer.status === 'active').length}명 · 정지 ${customers.filter((customer) => customer.status === 'blocked').length}명</span>
  </a>
`;
