import axios, { AxiosResponse, AxiosError } from 'axios';

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '' : '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерсептор для обработки ошибок
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Типы для стандартных ответов
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Базовые HTTP методы
export const apiCore = {
  // GET запрос
  get: async <T = any>(url: string): Promise<T> => {
    const response = await api.get<T>(url);
    return response.data;
  },

  // POST запрос
  post: async <T = any>(url: string, data?: any): Promise<T> => {
    const response = await api.post<T>(url, data);
    return response.data;
  },

  // PUT запрос
  put: async <T = any>(url: string, data?: any): Promise<T> => {
    const response = await api.put<T>(url, data);
    return response.data;
  },

  // PATCH запрос
  patch: async <T = any>(url: string, data?: any): Promise<T> => {
    const response = await api.patch<T>(url, data);
    return response.data;
  },

  // DELETE запрос
  delete: async <T = any>(url: string): Promise<T> => {
    const response = await api.delete<T>(url);
    return response.data;
  },

  // POST для загрузки файлов
  upload: async <T = any>(url: string, formData: FormData): Promise<T> => {
    const response = await api.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // GET для скачивания файлов
  download: async (url: string): Promise<Blob> => {
    const response = await api.get(url, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// Специфичные API методы для админки
export const adminApi = {
  // Пользователи
  users: {
    create: (data: any) => apiCore.post<ApiResponse>('/api/admin/users', data),
  },

  // Вакансии
  vacancies: {
    getAll: () => apiCore.get<any[]>('/api/admin/vacancies'),
    create: (data: any) => apiCore.post<ApiResponse>('/api/admin/vacancies', data),
    delete: (id: string) => apiCore.delete<ApiResponse>(`/api/admin/vacancies/${id}`),
    toggleStatus: (id: string, data: { isActive: boolean }) => 
      apiCore.patch<ApiResponse>(`/api/admin/vacancies/${id}`, data),
  },

  // Рассылки
  newsletters: {
    getAll: () => apiCore.get<any[]>('/api/admin/newsletters'),
    create: (data: any) => apiCore.post<ApiResponse>('/api/admin/newsletters', data),
    delete: (id: string) => apiCore.delete<ApiResponse>(`/api/admin/newsletters/${id}`),
  },

  // Загрузка файлов
  uploads: {
    image: (formData: FormData) => apiCore.upload<ApiResponse>('/api/upload/image', formData),
    slider: (formData: FormData) => apiCore.upload<ApiResponse>('/api/upload/slider', formData),
  },
};

// Экспортируем основной экземпляр для прямого использования
export { api };
export default apiCore;