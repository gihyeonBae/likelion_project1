export function resolveAssetPath(path, basePath = '.') {
  if (!path) {
    return '';
  }

  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) {
    return path;
  }

  if (path.startsWith('/')) {
    return path;
  }

  if (path.startsWith('./assets/')) {
    return `/${path.replace(/^\.\//, '')}`;
  }

  const normalizedBase = basePath.replace(/\/$/, '');
  const normalizedPath = path.replace(/^\.\//, '');
  return `${normalizedBase}/${normalizedPath}`;
}

export function createMenuImage(menu, { basePath = '.', className = '', lazy = true } = {}) {
  if (!menu?.imageUrl) {
    return `<span>${menu?.nameEn ?? 'Menu'}</span>`;
  }

  const src = resolveAssetPath(menu.imageUrl, basePath);
  const loading = lazy ? ' loading="lazy"' : '';
  const classAttribute = className ? ` class="${className}"` : '';
  return `<img${classAttribute} src="${src}" alt="${menu.nameKo} 메뉴 사진"${loading} onerror="this.hidden=true" />`;
}
