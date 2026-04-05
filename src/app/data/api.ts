import type { Product, Order } from './products';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('access_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

function getAdminAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('admin_access');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/products/`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/products/${id}/`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export async function createProduct(data: Omit<Product, 'id'> | FormData): Promise<Product> {
  const isFormData = data instanceof FormData;
  const res = await fetch(`${API_BASE_URL}/products/`, {
    method: 'POST',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...getAdminAuthHeaders()
    },
    body: isFormData ? data : JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

export async function updateProduct(id: number, data: Partial<Product> | FormData): Promise<Product> {
  const isFormData = data instanceof FormData;
  const res = await fetch(`${API_BASE_URL}/products/${id}/`, {
    method: 'PATCH',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...getAdminAuthHeaders()
    },
    body: isFormData ? data : JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/products/${id}/`, {
    method: 'DELETE',
    headers: {
      ...getAdminAuthHeaders()
    }
  });
  if (!res.ok) throw new Error('Failed to delete product');
}

export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch(`${API_BASE_URL}/orders/`, {
    headers: {
      ...getAuthHeaders()
    }
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function createOrder(data: any): Promise<Order> {
  const res = await fetch(`${API_BASE_URL}/orders/`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create order');
  return res.json();
}
