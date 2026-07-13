import { CUSTOMERS } from '../../../data/customers.js';
import { readStorage, removeStorage, writeStorage } from './storage.js';
import { runSupabaseQuery } from './supabase-client.js';

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

function mapCustomerRow(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    phone: row.phone,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    statusUpdatedAt: row.status_updated_at,
    withdrawnAt: row.withdrawn_at,
  };
}

function mapCustomerToRow(customer) {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    password: customer.password,
    phone: customer.phone,
    status: customer.status || 'active',
    created_at: customer.createdAt,
    updated_at: customer.updatedAt,
    status_updated_at: customer.statusUpdatedAt,
    withdrawn_at: customer.withdrawnAt,
  };
}

function getLocalCustomers() {
  return readStorage(CUSTOMERS_STORAGE_KEY, CUSTOMERS);
}

function saveLocalCustomers(customers) {
  return writeStorage(CUSTOMERS_STORAGE_KEY, customers);
}

export async function getCustomers() {
  const localCustomers = getLocalCustomers();
  const rows = await runSupabaseQuery(
    (client) => client.from('customers').select('*').order('created_at', { ascending: false }),
    undefined,
    'getCustomers',
  );

  return rows !== undefined ? rows.map(mapCustomerRow) : localCustomers;
}

export async function saveCustomers(customers) {
  const rows = await runSupabaseQuery(
    (client) => client.from('customers').upsert(customers.map(mapCustomerToRow)).select(),
    undefined,
    'saveCustomers',
  );

  return rows !== undefined ? rows.map(mapCustomerRow) : saveLocalCustomers(customers);
}

export async function getCustomerById(customerId) {
  const row = await runSupabaseQuery(
    (client) => client.from('customers').select('*').eq('id', customerId).maybeSingle(),
    undefined,
    'getCustomerById',
  );

  if (row !== undefined) {
    return row ? mapCustomerRow(row) : null;
  }

  return getLocalCustomers().find((customer) => customer.id === customerId) || null;
}

export async function getCustomerByEmail(email) {
  const row = await runSupabaseQuery(
    (client) => client.from('customers').select('*').eq('email', email).maybeSingle(),
    undefined,
    'getCustomerByEmail',
  );

  if (row !== undefined) {
    return row ? mapCustomerRow(row) : null;
  }

  return getLocalCustomers().find((customer) => customer.email === email) || null;
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

export async function getCurrentCustomer() {
  const session = getSession();
  return session ? sanitizeCustomer(await getCustomerById(session.customerId)) : null;
}

export async function signupCustomer({ name, email, password, phone }) {
  if (await getCustomerByEmail(email)) {
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

  const row = await runSupabaseQuery(
    (client) => client.from('customers').insert(mapCustomerToRow(customer)).select().single(),
    undefined,
    'signupCustomer',
  );

  if (row === undefined) {
    saveLocalCustomers([...getLocalCustomers(), customer]);
  }

  saveSession({ customerId: customer.id, signedInAt: new Date().toISOString() });
  return sanitizeCustomer(row ? mapCustomerRow(row) : customer);
}

export async function loginCustomer({ email, password }) {
  const customer = await getCustomerByEmail(email);

  if (!customer || customer.password !== password || customer.status !== 'active') {
    throw new Error('이메일 또는 비밀번호를 확인해 주세요.');
  }

  saveSession({ customerId: customer.id, signedInAt: new Date().toISOString() });
  return sanitizeCustomer(customer);
}

export async function updateCurrentCustomer(updates) {
  const session = getSession();

  if (!session) {
    throw new Error('로그인이 필요합니다.');
  }

  const currentCustomer = await getCustomerById(session.customerId);

  if (!currentCustomer) {
    throw new Error('회원 정보를 찾을 수 없습니다.');
  }

  const updatedCustomer = {
    ...currentCustomer,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const row = await runSupabaseQuery(
    (client) => client.from('customers').update(mapCustomerToRow(updatedCustomer)).eq('id', session.customerId).select().single(),
    undefined,
    'updateCurrentCustomer',
  );

  if (row !== undefined) {
    return sanitizeCustomer(mapCustomerRow(row));
  }

  const customers = getLocalCustomers().map((customer) => {
    if (customer.id !== session.customerId) {
      return customer;
    }

    return updatedCustomer;
  });

  saveLocalCustomers(customers);
  return sanitizeCustomer(updatedCustomer);
}

export async function withdrawCurrentCustomer() {
  const session = getSession();

  if (!session) {
    return;
  }

  const currentCustomer = await getCustomerById(session.customerId);

  if (!currentCustomer) {
    clearSession();
    return;
  }

  const withdrawnCustomer = {
    ...currentCustomer,
    status: 'withdrawn',
    withdrawnAt: new Date().toISOString(),
  };

  const row = await runSupabaseQuery(
    (client) => client.from('customers').update(mapCustomerToRow(withdrawnCustomer)).eq('id', session.customerId).select().single(),
    undefined,
    'withdrawCurrentCustomer',
  );

  if (row !== undefined) {
    clearSession();
    return;
  }

  const customers = getLocalCustomers().map((customer) => {
    if (customer.id !== session.customerId) {
      return customer;
    }

    return withdrawnCustomer;
  });

  saveLocalCustomers(customers);
  clearSession();
}

export async function updateCustomerStatus(customerId, status) {
  const currentCustomer = await getCustomerById(customerId);

  if (!currentCustomer) {
    return null;
  }

  const updatedCustomer = {
    ...currentCustomer,
    status,
    statusUpdatedAt: new Date().toISOString(),
  };

  const row = await runSupabaseQuery(
    (client) => client.from('customers').update(mapCustomerToRow(updatedCustomer)).eq('id', customerId).select().single(),
    undefined,
    'updateCustomerStatus',
  );

  if (row !== undefined) {
    return mapCustomerRow(row);
  }

  const customers = getLocalCustomers().map((customer) => {
    if (customer.id !== customerId) {
      return customer;
    }

    return updatedCustomer;
  });

  saveLocalCustomers(customers);
  return updatedCustomer;
}
