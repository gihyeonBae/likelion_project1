import { getSession } from './auth-service.js';
import { readStorage, writeStorage } from './storage.js';

const INQUIRIES_STORAGE_KEY = 'inquiries';

function createInquiryId() {
  return `inquiry-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getInquiries() {
  return readStorage(INQUIRIES_STORAGE_KEY, []);
}

export function saveInquiries(inquiries) {
  return writeStorage(INQUIRIES_STORAGE_KEY, inquiries);
}

export function getInquiryById(inquiryId) {
  return getInquiries().find((inquiry) => inquiry.id === inquiryId) || null;
}

export function getCurrentCustomerInquiries() {
  const session = getSession();
  return session
    ? getInquiries().filter((inquiry) => inquiry.customerId === session.customerId)
    : [];
}

export function createInquiry({ title, category, message, customer }) {
  const inquiry = {
    id: createInquiryId(),
    customerId: customer.id,
    customerName: customer.name,
    title,
    category,
    message,
    status: 'waiting',
    answer: '',
    createdAt: new Date().toISOString(),
  };

  saveInquiries([inquiry, ...getInquiries()]);
  return inquiry;
}

export function updateInquiry(inquiryId, updates) {
  const inquiries = getInquiries().map((inquiry) => {
    if (inquiry.id !== inquiryId) {
      return inquiry;
    }

    return {
      ...inquiry,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  });

  saveInquiries(inquiries);
  return getInquiryById(inquiryId);
}

export function deleteInquiry(inquiryId) {
  saveInquiries(getInquiries().filter((inquiry) => inquiry.id !== inquiryId));
}
