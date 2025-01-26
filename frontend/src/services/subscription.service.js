import api from '../utils/axios.config';

export const subscriptionService = {
  toggleSubscription: async (channelId) => {
    const response = await api.post(`/subscriptions/c/${channelId}`);
    return response.data;
  },

  getSubscribedChannels: async () => {
    const response = await api.get('/subscriptions/channels');
    return response.data;
  },

  getChannelSubscribers: async (channelId) => {
    const response = await api.get(`/subscriptions/subscribers/${channelId}`);
    return response.data;
  }
};
