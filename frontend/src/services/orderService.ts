import api from './axiosConfig';

export const orderService = {
  createOrder: async (data: {
    items: Array<{ product_id: string; quantity: number }>;
    shipping_address: {
      full_name: string;
      address_line1: string;
      address_line2?: string;
      city: string;
      region: string;
      postal_code: string;
      country: string;
    };
    total_amount?: number;
  }) => {
    const response = await api.post('/api/orders', data);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create order');
  },

  getMyOrders: async () => {
    const response = await api.get('/api/orders/myorders');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch user orders');
  },

  getOrderById: async (id: string) => {
    const response = await api.get(`/api/orders/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch order');
  },

  getAllOrders: async () => {
    const response = await api.get('/api/orders');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch all orders');
  },

  updateOrderStatus: async (id: string, status: string) => {
    const response = await api.put(`/api/orders/${id}/status`, { status });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update order status');
  }
};
