import { readStorage, writeStorage } from './storage.js';
import { runSupabaseQuery } from './supabase-client.js';

const ORDER_STORAGE_KEY = 'orders';

function createOrderId() {
  const timestamp = new Date();
  const date = timestamp.toISOString().slice(0, 10).replaceAll('-', '');
  const suffix = Math.random().toString(16).slice(2, 8).toUpperCase();
  return `ORD-${date}-${suffix}`;
}

function mapOrderRow(row) {
  return {
    id: row.id,
    items: row.items ?? [],
    pickupName: row.pickup_name,
    pickupPhone: row.pickup_phone,
    pickupTime: row.pickup_time,
    requestMessage: row.request_message,
    totalPrice: row.total_price,
    status: row.status,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method,
    paymentReceiptId: row.payment_receipt_id,
    channel: row.channel,
    adminMemo: row.admin_memo,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    canceledAt: row.canceled_at,
    paidAt: row.paid_at,
  };
}

function mapOrderToRow(order) {
  return {
    id: order.id,
    items: order.items ?? [],
    pickup_name: order.pickupName,
    pickup_phone: order.pickupPhone,
    pickup_time: order.pickupTime,
    request_message: order.requestMessage || '',
    total_price: Number(order.totalPrice) || 0,
    status: order.status || 'received',
    payment_status: order.paymentStatus || 'before-payment',
    payment_method: order.paymentMethod,
    payment_receipt_id: order.paymentReceiptId,
    channel: order.channel || 'online',
    admin_memo: order.adminMemo || '',
    created_at: order.createdAt,
    updated_at: order.updatedAt,
    canceled_at: order.canceledAt,
    paid_at: order.paidAt,
  };
}

function getLocalOrders() {
  return readStorage(ORDER_STORAGE_KEY, []);
}

function saveLocalOrders(orders) {
  return writeStorage(ORDER_STORAGE_KEY, orders);
}

export async function getOrders() {
  const localOrders = getLocalOrders();
  const rows = await runSupabaseQuery(
    (client) => client.from('orders').select('*').order('created_at', { ascending: false }),
    undefined,
    'getOrders',
  );

  return rows !== undefined ? rows.map(mapOrderRow) : localOrders;
}

export async function saveOrders(orders) {
  const rows = await runSupabaseQuery(
    (client) => client.from('orders').upsert(orders.map(mapOrderToRow)).select(),
    undefined,
    'saveOrders',
  );

  return rows !== undefined ? rows.map(mapOrderRow) : saveLocalOrders(orders);
}

export async function getOrderById(orderId) {
  const row = await runSupabaseQuery(
    (client) => client.from('orders').select('*').eq('id', orderId).maybeSingle(),
    undefined,
    'getOrderById',
  );

  if (row !== undefined) {
    return row ? mapOrderRow(row) : null;
  }

  return getLocalOrders().find((order) => order.id === orderId) || null;
}

export async function createOrder(orderData) {
  const order = {
    id: createOrderId(),
    items: orderData.items,
    pickupName: orderData.pickupName,
    pickupPhone: orderData.pickupPhone,
    pickupTime: orderData.pickupTime,
    requestMessage: orderData.requestMessage || '',
    totalPrice: orderData.totalPrice,
    status: 'received',
    paymentStatus: 'before-payment',
    channel: orderData.channel || 'online',
    adminMemo: orderData.adminMemo || '',
    createdAt: new Date().toISOString(),
  };

  const row = await runSupabaseQuery(
    (client) => client.from('orders').insert(mapOrderToRow(order)).select().single(),
    undefined,
    'createOrder',
  );

  if (row !== undefined) {
    return mapOrderRow(row);
  }

  saveLocalOrders([order, ...getLocalOrders()]);
  return order;
}

export async function updateOrder(orderId, updates) {
  const currentOrder = await getOrderById(orderId);

  if (!currentOrder) {
    return null;
  }

  const updatedOrder = {
    ...currentOrder,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const row = await runSupabaseQuery(
    (client) => client.from('orders').update(mapOrderToRow(updatedOrder)).eq('id', orderId).select().single(),
    undefined,
    'updateOrder',
  );

  if (row !== undefined) {
    return mapOrderRow(row);
  }

  const orders = getLocalOrders().map((order) => {
    if (order.id !== orderId) {
      return order;
    }

    return updatedOrder;
  });

  saveLocalOrders(orders);
  return getLocalOrders().find((order) => order.id === orderId) || null;
}

export async function cancelOrder(orderId) {
  return updateOrder(orderId, {
    status: 'canceled',
    canceledAt: new Date().toISOString(),
  });
}

export async function deleteOrder(orderId) {
  const row = await runSupabaseQuery(
    (client) => client.from('orders').delete().eq('id', orderId),
    undefined,
    'deleteOrder',
  );

  if (row !== undefined) {
    return;
  }

  saveLocalOrders(getLocalOrders().filter((order) => order.id !== orderId));
}
