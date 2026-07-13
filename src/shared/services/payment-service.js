import { readStorage, writeStorage } from './storage.js';
import { isSupabaseConfigured, runRequiredSupabaseQuery, runSupabaseQuery } from './supabase-client.js';
import { updateOrder } from './order-service.js';

const PAYMENT_STORAGE_KEY = 'payments';

export const PAYMENT_METHODS = [
  { value: 'card', label: '카드 결제' },
  { value: 'simple-pay', label: '간편 결제' },
  { value: 'bank-transfer', label: '계좌 이체' },
  { value: 'cash', label: '현금 결제' },
];

function createPaymentId() {
  return `PAY-${Date.now()}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
}

function createReceiptId() {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  return `RCPT-${date}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
}

function mapPaymentRow(row) {
  return {
    id: row.id,
    orderId: row.order_id,
    amount: row.amount,
    method: row.method,
    status: row.status,
    receiptId: row.receipt_id,
    paidAt: row.paid_at,
    createdAt: row.created_at,
  };
}

function mapPaymentToRow(payment) {
  return {
    id: payment.id,
    order_id: payment.orderId,
    amount: Number(payment.amount) || 0,
    method: payment.method,
    status: payment.status || 'paid',
    receipt_id: payment.receiptId,
    paid_at: payment.paidAt,
    created_at: payment.createdAt,
  };
}

function getLocalPayments() {
  return readStorage(PAYMENT_STORAGE_KEY, []);
}

function saveLocalPayments(payments) {
  return writeStorage(PAYMENT_STORAGE_KEY, payments);
}

export function getPaymentMethodLabel(method) {
  return PAYMENT_METHODS.find((item) => item.value === method)?.label ?? '결제 수단 미정';
}

export async function getPayments() {
  const localPayments = getLocalPayments();
  const rows = await runSupabaseQuery(
    (client) => client.from('payments').select('*').order('created_at', { ascending: false }),
    undefined,
    'getPayments',
  );

  return rows !== undefined ? rows.map(mapPaymentRow) : localPayments;
}

export async function getPaymentByOrderId(orderId) {
  const row = await runSupabaseQuery(
    (client) => client.from('payments').select('*').eq('order_id', orderId).maybeSingle(),
    undefined,
    'getPaymentByOrderId',
  );

  if (row !== undefined) {
    return row ? mapPaymentRow(row) : null;
  }

  return getLocalPayments().find((payment) => payment.orderId === orderId) || null;
}

export async function createPayment({ order, method }) {
  if (!order) {
    throw new Error('결제할 주문을 찾을 수 없습니다.');
  }

  if (order.paymentStatus === 'paid') {
    throw new Error('이미 결제된 주문입니다.');
  }

  const payment = {
    id: createPaymentId(),
    orderId: order.id,
    amount: order.totalPrice,
    method,
    status: 'paid',
    receiptId: createReceiptId(),
    paidAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  const row = isSupabaseConfigured()
    ? await runRequiredSupabaseQuery(
      (client) => client.from('payments').insert(mapPaymentToRow(payment)).select().single(),
      'createPayment',
    )
    : undefined;
  const savedPayment = row ? mapPaymentRow(row) : payment;

  saveLocalPayments([savedPayment, ...getLocalPayments().filter((item) => item.id !== savedPayment.id)]);

  await updateOrder(order.id, {
    paymentStatus: 'paid',
    paymentMethod: savedPayment.method,
    paymentReceiptId: savedPayment.receiptId,
    paidAt: savedPayment.paidAt,
  });

  return savedPayment;
}
