import api from './axiosConfig';

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock_quantity: number;
}

export const productService = {
  getAllProducts: async (params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/api/products', { params });
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || 'Failed to fetch products');
  },

  getProductById: async (id: string) => {
    const response = await api.get(`/api/products/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch product');
  },

  createProduct: async (data: ProductFormData) => {
    const response = await api.post('/api/products', data);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create product');
  },

  updateProduct: async (id: string, data: ProductFormData) => {
    const response = await api.put(`/api/products/${id}`, data);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update product');
  },

  deleteProduct: async (id: string) => {
    const response = await api.delete(`/api/products/${id}`);
    if (response.data.success) {
      return response.data.message;
    }
    throw new Error(response.data.message || 'Failed to delete product');
  }
};
