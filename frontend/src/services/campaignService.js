import API from './api';

export const createCampaign = async (campaignData) => {
  const response = await API.post('/campaigns', campaignData);
  return response.data;
};

export const getCampaigns = async () => {
  const response = await API.get('/campaigns');
  return response.data;
};

export const getCampaignById = async (id) => {
  const response = await API.get(`/campaigns/${id}`);
  return response.data;
};

export const sendCampaign = async (id) => {
  const response = await API.post(`/campaigns/${id}/send`);
  return response.data;
};
