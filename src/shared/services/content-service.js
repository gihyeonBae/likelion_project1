import { BANNERS, NOTICES } from '../../../data/content.js';
import { readStorage, writeStorage } from './storage.js';

const BANNERS_STORAGE_KEY = 'content-banners';
const NOTICES_STORAGE_KEY = 'content-notices';

function createContentId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getBanners() {
  return readStorage(BANNERS_STORAGE_KEY, BANNERS);
}

export function saveBanners(banners) {
  return writeStorage(BANNERS_STORAGE_KEY, banners);
}

export function getBannerById(bannerId) {
  return getBanners().find((banner) => banner.id === bannerId) || null;
}

export function createBanner(bannerData) {
  const banner = {
    id: createContentId('banner'),
    title: bannerData.title,
    description: bannerData.description,
    linkLabel: bannerData.linkLabel || '메뉴 보기',
    linkUrl: bannerData.linkUrl || './src/customer/menu/read/list/index.html',
    sortOrder: Number(bannerData.sortOrder) || getBanners().length + 1,
    isVisible: Boolean(bannerData.isVisible),
    createdAt: new Date().toISOString(),
  };

  saveBanners([banner, ...getBanners()]);
  return banner;
}

export function updateBanner(bannerId, updates) {
  const banners = getBanners().map((banner) => {
    if (banner.id !== bannerId) {
      return banner;
    }

    return {
      ...banner,
      ...updates,
      sortOrder: Number(updates.sortOrder) || banner.sortOrder,
      isVisible: Boolean(updates.isVisible),
      updatedAt: new Date().toISOString(),
    };
  });

  saveBanners(banners);
  return getBannerById(bannerId);
}

export function deleteBanner(bannerId) {
  saveBanners(getBanners().filter((banner) => banner.id !== bannerId));
}

export function getNotices() {
  return readStorage(NOTICES_STORAGE_KEY, NOTICES);
}

export function saveNotices(notices) {
  return writeStorage(NOTICES_STORAGE_KEY, notices);
}

export function getNoticeById(noticeId) {
  return getNotices().find((notice) => notice.id === noticeId) || null;
}

export function createNotice(noticeData) {
  const notice = {
    id: createContentId('notice'),
    title: noticeData.title,
    category: noticeData.category,
    message: noticeData.message,
    isPinned: Boolean(noticeData.isPinned),
    isVisible: Boolean(noticeData.isVisible),
    createdAt: new Date().toISOString(),
  };

  saveNotices([notice, ...getNotices()]);
  return notice;
}

export function updateNotice(noticeId, updates) {
  const notices = getNotices().map((notice) => {
    if (notice.id !== noticeId) {
      return notice;
    }

    return {
      ...notice,
      ...updates,
      isPinned: Boolean(updates.isPinned),
      isVisible: Boolean(updates.isVisible),
      updatedAt: new Date().toISOString(),
    };
  });

  saveNotices(notices);
  return getNoticeById(noticeId);
}

export function deleteNotice(noticeId) {
  saveNotices(getNotices().filter((notice) => notice.id !== noticeId));
}
