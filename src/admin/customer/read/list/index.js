import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getCustomers } from '../../../../shared/services/auth-service.js';
import { createCustomerRow } from '../../_shared/admin-customer.js';

const basePath = '../../../../..';

document.getElementById('app-header').innerHTML = renderHeader('admin', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();

const customers = await getCustomers();
const statusFilter = document.getElementById('status-filter');

function renderCustomers() {
  const filteredCustomers = customers.filter((customer) => statusFilter.value === 'all' || customer.status === statusFilter.value);

  document.getElementById('customer-summary').textContent = `고객 ${filteredCustomers.length}명`;
  document.getElementById('customer-list').innerHTML = filteredCustomers.length
    ? filteredCustomers.map((customer) => createCustomerRow(customer, { basePath })).join('')
    : '<p class="empty-state">조건에 맞는 고객이 없습니다.</p>';
}

statusFilter.addEventListener('change', renderCustomers);
renderCustomers();
