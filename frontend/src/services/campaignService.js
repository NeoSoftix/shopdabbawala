import API from './api';

export const createCampaign = async (campaignData) => {
  const response = await API.post('/campaigns', campaignData);
  return response.data;
};

export const getCampaigns = async (page = 1, limit = 10) => {
  const response = await API.get('/campaigns', { params: { page, limit } });
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

export const updateCampaign = async (id, campaignData) => {
  const response = await API.put(`/campaigns/${id}`, campaignData);
  return response.data;
};

export const deleteCampaign = async (id) => {
  const response = await API.delete(`/campaigns/${id}`);
  return response.data;
};

export const scheduleCampaign = async (campaignId, scheduledAt) => {
  const response = await API.post('/campaigns/schedule', { campaignId, scheduledAt });
  return response.data;
};

export const searchAudienceUsers = async (search, role) => {
  const response = await API.get('/campaigns/audience/search', { params: { search, role } });
  return response.data;
};

export const previewCampaignAudience = async (filters) => {
  const response = await API.post('/campaigns/audience/preview', { filters });
  return response.data;
};
