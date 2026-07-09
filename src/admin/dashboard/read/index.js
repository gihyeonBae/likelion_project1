import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';
import { getCategories } from '../../../shared/services/category-service.js';
import { getInventoryItems } from '../../../shared/services/inventory-service.js';
import { getMenus } from '../../../shared/services/menu-service.js';
import { getOrders } from '../../../shared/services/order-service.js';
import { getComputedInventoryStatus } from '../../inventory/_shared/admin-inventory.js';

document.getElementById('app-header').innerHTML = renderHeader('admin', '../../../..');
document.getElementById('app-footer').innerHTML = renderFooter();

const menus = getMenus();
const categories = getCategories();
const orders = getOrders();
const inventoryItems = getInventoryItems();
const urgentInventoryCount = inventoryItems.filter((item) => ['low', 'sold-out'].includes(getComputedInventoryStatus(item))).length;

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
  <a class="category-card" href="../../inventory/read/list/index.html">
    <p>Inventory</p>
    <h3>${inventoryItems.length}개 재고</h3>
    <span>주의 필요 ${urgentInventoryCount}개</span>
  </a>
`;
