import { readStorage, writeStorage } from './storage.js';

const ORDER_STORAGE_KEY = 'orders';

function createOrderId() {
  const timestamp = new Date();
  const date = timestamp.toISOString().slice(0, 10).replaceAll('-', '');
  const suffix = Math.random().toString(16).slice(2, 8).toUpperCase();
  return `ORD-${date}-${suffix}`;
}

export function getOrders() {
  return readStorage(ORDER_STORAGE_KEY, []);
}

export function saveOrders(orders) {
  return writeStorage(ORDER_STORAGE_KEY, orders);
}

export function getOrderById(orderId) {
  return getOrders().find((order) => order.id === orderId) || null;
}

export function createOrder(orderData) {
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

  saveOrders([order, ...getOrders()]);
  return order;
}

export function updateOrder(orderId, updates) {
  const orders = getOrders().map((order) => {
    if (order.id !== orderId) {
      return order;
    }

    return {
      ...order,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  });

  saveOrders(orders);
  return getOrderById(orderId);
}

export function cancelOrder(orderId) {
  return updateOrder(orderId, {
    status: 'canceled',
    canceledAt: new Date().toISOString(),
  });
}

export function deleteOrder(orderId) {
  saveOrders(getOrders().filter((order) => order.id !== orderId));
}
