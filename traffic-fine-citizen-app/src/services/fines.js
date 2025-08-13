import api from './api';

export const getFines = async () => {
  try {
    const response = await api.get('/fines');
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch fines');
  }
};

export const getFineById = async (id) => {
  try {
    const response = await api.get(`/fines/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch fine details');
  }
};

export const payFine = async (id, paymentData) => {
  try {
    const response = await api.post(`/fines/${id}/pay`, paymentData);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Payment failed');
  }
};

export const submitDispute = async (id, disputeData) => {
  try {
    const formData = new FormData();
    formData.append('reason', disputeData.reason);
    formData.append('explanation', disputeData.explanation);
    
    if (disputeData.files && disputeData.files.length > 0) {
      disputeData.files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });
    }

    const response = await api.post(`/fines/${id}/dispute`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to submit dispute');
  }
};