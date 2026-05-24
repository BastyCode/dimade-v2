const BASE_URL = 'http://localhost:8080'; // URL del API Gateway

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('dimade_token') : null;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('dimade_token');
    window.location.href = '/auth/login';
    throw new Error('Sesión expirada');
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error');
    throw new Error(`API Error: ${response.status} - ${errorBody}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const authApi = {
  login: (credentials: any) => apiFetch<any>('/api/v1/auth/authenticate', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (data: any) => apiFetch<any>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  // Gestión de usuarios
  getUsers: () => apiFetch<any[]>('/api/v1/users'),
  updateUserStatus: (id: number, enabled: boolean) => apiFetch<any>(`/api/v1/users/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ enabled }),
  }),
  deleteUser: (id: number) => apiFetch<void>(`/api/v1/users/${id}`, {
    method: 'DELETE',
  }),
  approveUser: (id: number) => apiFetch<any>(`/api/v1/users/${id}/approve`, {
    method: 'PUT',
  }),
};

export const catalogApi = {
  // Categorías
  getCategories: () => apiFetch<any[]>('/api/v1/categories'),
  getCategory: (id: number) => apiFetch<any>(`/api/v1/categories/${id}`),
  createCategory: (data: any) => apiFetch<any>('/api/v1/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateCategory: (id: number, data: any) => apiFetch<any>(`/api/v1/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteCategory: (id: number) => apiFetch<void>(`/api/v1/categories/${id}`, {
    method: 'DELETE',
  }),

  // Productos
  getProducts: () => apiFetch<any[]>('/api/v1/products'),
  getProduct: (id: number) => apiFetch<any>(`/api/v1/products/${id}`),
  createProduct: (data: any) => apiFetch<any>('/api/v1/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateProduct: (id: number, data: any) => apiFetch<any>(`/api/v1/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteProduct: (id: number) => apiFetch<void>(`/api/v1/products/${id}`, {
    method: 'DELETE',
  }),
};

export const crmApi = {
  // Clientes
  getClients: () => apiFetch<any[]>('/api/crm/clients'),
  getClient: (id: number) => apiFetch<any>(`/api/crm/clients/${id}`),
  createClient: (data: any) => apiFetch<any>('/api/crm/clients', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateClient: (id: number, data: any) => apiFetch<any>(`/api/crm/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteClient: (id: number) => apiFetch<void>(`/api/crm/clients/${id}`, {
    method: 'DELETE',
  }),

  // Proveedores
  getSuppliers: () => apiFetch<any[]>('/api/crm/suppliers'),
  getSupplier: (id: number) => apiFetch<any>(`/api/crm/suppliers/${id}`),
  createSupplier: (data: any) => apiFetch<any>('/api/crm/suppliers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateSupplier: (id: number, data: any) => apiFetch<any>(`/api/crm/suppliers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteSupplier: (id: number) => apiFetch<void>(`/api/crm/suppliers/${id}`, {
    method: 'DELETE',
  }),

  // Cotizaciones de Proveedores (Inbound)
  getSupplierQuotes: () => apiFetch<any[]>('/api/crm/supplier-quotes'),
  createSupplierQuote: (data: any) => apiFetch<any>('/api/crm/supplier-quotes', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  deleteSupplierQuote: (id: number) => apiFetch<void>(`/api/crm/supplier-quotes/${id}`, {
    method: 'DELETE',
  }),
};
