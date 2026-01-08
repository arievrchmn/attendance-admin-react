// src/lib/api.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export class ApiError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('access_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data.message || 'An error occurred');
  }

  return data;
}

// Auth APIs
export const authApi = {
  login: (email: string, password: string) =>
    fetchApi<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// Admin sub APIs
export const subApi = {
  subscribeTopic: (fcmToken: string, topic: string) =>
    fetchApi<null>('/admin/subscribe-topic', {
      method: 'POST',
      body: JSON.stringify({ fcm_token: fcmToken, topic }),
    }),
};

// Profile APIs
export const staffApi = {
  getProfile: () =>
    fetchApi<{
      name: string;
      email: string;
      position: string;
      phone: string;
      photo_url: string;
    }>('/staff/profile'),
};

// Employee Types & APIs
export interface Employee {
  id: number;
  email: string;
  role: string;
  is_active: boolean;
  name: string;
  phone: string;
  photo_url: string;
  position: string;
}

export const employeeApi = {
  getAll: (params: { page?: number; limit?: number; name?: string }) => {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.name) query.set('name', params.name);
    return fetchApi<Employee[]>(`/admin/employees?${query.toString()}`);
  },

  create: (data: {
    email: string;
    password: string;
    name: string;
    phone: string;
    photo_url: string;
    position: string;
  }) =>
    fetchApi<null>('/admin/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (
    id: number,
    data: {
      name?: string;
      phone?: string;
      photo_url?: string;
      position?: string;
      password?: string;
    }
  ) =>
    fetchApi<null>(`/admin/employees/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    fetchApi<null>(`/admin/employees/${id}`, {
      method: 'DELETE',
    }),
};

// Attendance Types & APIs
export interface Attendance {
  id: number;
  date: string;
  check_in: string;
  check_out: string;
  user: {
    name: string;
    position: string;
  };
}

export const attendanceApi = {
  getAll: (params: { page?: number; limit?: number; start_date?: string; end_date?: string }) => {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.start_date) query.set('start_date', params.start_date);
    if (params.end_date) query.set('end_date', params.end_date);
    return fetchApi<Attendance[]>(`/admin/attendances?${query.toString()}`);
  },
};
