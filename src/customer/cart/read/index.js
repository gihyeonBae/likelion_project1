import { renderHeader } from '../../../shared/components/header.js';
import { renderFooter } from '../../../shared/components/footer.js';

document.getElementById('app-header').innerHTML = renderHeader('cart', '../../../..');
document.getElementById('app-footer').innerHTML = renderFooter();
