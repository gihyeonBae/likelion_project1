import { renderHeader } from '../../../../shared/components/header.js';
import { renderFooter } from '../../../../shared/components/footer.js';
import { getMenus } from '../../../../shared/services/menu-service.js';
import { createMenuGrid } from '../../_shared/menu-renderer.js';
import { filterMenus, sortMenus } from '../../_shared/menu-filter.js';

const basePath = '../../../../..';
const params = new URLSearchParams(window.location.search);
const keyword = params.get('keyword') || '';
const input = document.getElementById('keyword-input');
const results = sortMenus(filterMenus(getMenus(), { keyword }));

document.getElementById('app-header').innerHTML = renderHeader('menu', basePath);
document.getElementById('app-footer').innerHTML = renderFooter();
input.value = keyword;
document.getElementById('result-summary').textContent = keyword
  ? `"${keyword}" 검색 결과 ${results.length}개`
  : '검색어를 입력하면 메뉴를 찾을 수 있습니다.';
document.getElementById('search-results').innerHTML = createMenuGrid(results, {
  basePath,
  emptyMessage: '검색 결과가 없습니다.',
});
