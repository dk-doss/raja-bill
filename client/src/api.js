// API client for RAJA STORE

const BASE_URL = '';

export async function fetchStoreInfo() {
  const res = await fetch(`${BASE_URL}/api/store/info`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function updateStoreInfo(data) {
  const res = await fetch(`${BASE_URL}/api/store/info`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/api/categories`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function createCategory(cat) {
  const res = await fetch(`${BASE_URL}/api/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cat)
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function updateCategory(id, cat) {
  const res = await fetch(`${BASE_URL}/api/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cat)
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function deleteCategory(id) {
  const res = await fetch(`${BASE_URL}/api/categories/${id}`, {
    method: 'DELETE'
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json;
}

export async function fetchProducts({ categoryId, search, inStockOnly, admin = false } = {}) {
  const params = new URLSearchParams();
  if (categoryId) params.append('categoryId', categoryId);
  if (search) params.append('search', search);
  if (inStockOnly) params.append('inStockOnly', 'true');
  if (admin) params.append('admin', 'true');

  const res = await fetch(`${BASE_URL}/api/products?${params.toString()}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function createProduct(prod) {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prod)
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function updateProduct(id, prod) {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prod)
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function updateProductStock(id, stock) {
  const res = await fetch(`${BASE_URL}/api/products/${id}/stock`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock })
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function deleteProduct(id) {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: 'DELETE'
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json;
}

export async function placeOrder(orderData) {
  const res = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to place order');
  return json.data;
}

export async function fetchOrders({ status, search } = {}) {
  const params = new URLSearchParams();
  if (status && status !== 'ALL') params.append('status', status);
  if (search) params.append('search', search);

  const res = await fetch(`${BASE_URL}/api/orders?${params.toString()}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function fetchOrderStats() {
  const res = await fetch(`${BASE_URL}/api/orders/stats`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function fetchOrderByIdentifier(identifier) {
  const res = await fetch(`${BASE_URL}/api/orders/${encodeURIComponent(identifier)}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function fetchOrdersByPhone(phone) {
  const res = await fetch(`${BASE_URL}/api/orders/by-phone/${encodeURIComponent(phone)}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function updateOrderStatus(orderId, status, note = '', cancelReason = '') {
  const res = await fetch(`${BASE_URL}/api/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, note, cancelReason })
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function loginStaff(username, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Authentication failed');
  return json;
}

export async function resetDatabase() {
  const res = await fetch(`${BASE_URL}/api/admin/reset`, {
    method: 'POST'
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json;
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Upload failed');
  return json.url;
}

// SSE Event Stream helper
export function subscribeToEvents(onEvent) {
  const eventSource = new EventSource(`${BASE_URL}/api/events`);

  eventSource.onmessage = (event) => {
    try {
      const parsed = JSON.parse(event.data);
      if (onEvent) onEvent(parsed);
    } catch (e) {
      // heartbeats or ping
    }
  };

  eventSource.onerror = (err) => {
    // browser will auto-reconnect SSE
    console.debug('SSE reconnecting...', err);
  };

  return () => {
    eventSource.close();
  };
}
