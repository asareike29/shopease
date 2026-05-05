import axiosInstance from './axiosConfig';

interface InitializePaymentParams {
  email: string;
  amount: number;
  orderId: string;
}

interface InitializePaymentResponse {
  authorization_url: string;
  reference: string;
  access_code: string;
}

interface VerifyPaymentResponse {
  success: boolean;
  orderId: string;
  reference: string;
  amount: number;
}

const paymentService = {
  initializePayment: async (
    params: InitializePaymentParams
  ): Promise<InitializePaymentResponse> => {
    const response = await axiosInstance.post(
      '/api/payments/initialize', params
    );
    return response.data;
  },

  verifyPayment: async (
    reference: string
  ): Promise<VerifyPaymentResponse> => {
    const response = await axiosInstance.get(
      `/api/payments/verify/${reference}`
    );
    return response.data;
  },
};

export default paymentService;
