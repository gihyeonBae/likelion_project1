import { CUSTOMERS } from '../../../data/customers.js';
import { readStorage, removeStorage, writeStorage } from './storage.js';

const SESSION_STORAGE_KEY = 'session';
const CUSTOMERS_STORAGE_KEY = 'customers';

function createCustomerId() {
  return `customer-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function sanitizeCustomer(customer) {
  if (!customer) {
    return null;
  }

  const { password, ...safeCustomer } = customer;
  return safeCustomer;
}

export function getCustomers() {
  return readStorage(CUSTOMERS_STORAGE_KEY, CUSTOMERS);
}

export function saveCustomers(customers) {
  return writeStorage(CUSTOMERS_STORAGE_KEY, customers);
}

export function getCustomerById(customerId) {
  return getCustomers().find((customer) => customer.id === customerId) || null;
}

export function getCustomerByEmail(email) {
  return getCustomers().find((customer) => customer.email === email) || null;
}

export function getSession() {
  return readStorage(SESSION_STORAGE_KEY, null);
}

export function saveSession(session) {
  return writeStorage(SESSION_STORAGE_KEY, session);
}

export function clearSession() {
  removeStorage(SESSION_STORAGE_KEY);
}

export function getCurrentCustomer() {
  const session = getSession();
  return session ? sanitizeCustomer(getCustomerById(session.customerId)) : null;
}

export function signupCustomer({ name, email, password, phone }) {
  if (getCustomerByEmail(email)) {
    throw new Error('이미 가입된 이메일입니다.');
  }

  const customer = {
    id: createCustomerId(),
    name,
    email,
    password,
    phone,
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  saveCustomers([...getCustomers(), customer]);
  saveSession({ customerId: customer.id, signedInAt: new Date().toISOString() });
  return sanitizeCustomer(customer);
}

export function loginCustomer({ email, password }) {
  const customer = getCustomerByEmail(email);

  if (!customer || customer.password !== password || customer.status !== 'active') {
    throw new Error('이메일 또는 비밀번호를 확인해 주세요.');
  }

  saveSession({ customerId: customer.id, signedInAt: new Date().toISOString() });
  return sanitizeCustomer(customer);
}

export function updateCurrentCustomer(updates) {
  const session = getSession();

  if (!session) {
    throw new Error('로그인이 필요합니다.');
  }

  const customers = getCustomers().map((customer) => {
    if (customer.id !== session.customerId) {
      return customer;
    }

    return {
      ...customer,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  });

  saveCustomers(customers);
  return getCurrentCustomer();
}

export function withdrawCurrentCustomer() {
  const session = getSession();

  if (!session) {
    return;
  }

  const customers = getCustomers().map((customer) => {
    if (customer.id !== session.customerId) {
      return customer;
    }

    return {
      ...customer,
      status: 'withdrawn',
      withdrawnAt: new Date().toISOString(),
    };
  });

  saveCustomers(customers);
  clearSession();
}

export function updateCustomerStatus(customerId, status) {
  const customers = getCustomers().map((customer) => {
    if (customer.id !== customerId) {
      return customer;
    }

    return {
      ...customer,
      status,
      statusUpdatedAt: new Date().toISOString(),
    };
  });

  saveCustomers(customers);
  return getCustomerById(customerId);
}
