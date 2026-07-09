import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getOrders } from '../../../../shared/services/order-service.js';
import { createOrderListCard } from '../../_shared/order-renderer.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('order', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const orders = getOrders();

document.getElementById('order-list').innerHTML = orders.length
  ? orders.map((order) => createOrderListCard(order, { basePath })).join('')
  : `
    <div class="empty-state">
      <p>아직 주문 내역이 없습니다.</p>
      <a class="button button--primary" href="../../../menu/read/list/index.html">첫 주문 시작하기</a>
    </div>
  `;
