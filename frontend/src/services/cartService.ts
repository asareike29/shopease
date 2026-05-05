import api from './axiosConfig';

export const cartService = {
  getCart: async () => {
    const response = await api.get('/api/cart');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch cart');
  },

  addToCart: async (data: { product_id: string; quantity: number }) => {
    const response = await api.post('/api/cart', data);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to add to cart');
  },

  updateCartItem: async (itemId: string, quantity: number) => {
    const response = await api.put(`/api/cart/${itemId}`, { quantity });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update cart item');
  },

  removeCartItem: async (itemId: string) => {
    const response = await api.delete(`/api/cart/${itemId}`);
    if (response.data.success) {
      return response.data.message;
    }
    throw new Error(response.data.message || 'Failed to remove cart item');
  },

  clearCart: async () => {
    const response = await api.delete('/api/cart');
    if (response.data.success) {
      return response.data.message;
    }
    throw new Error(response.data.message || 'Failed to clear cart');
  }
};
