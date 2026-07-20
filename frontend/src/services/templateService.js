import API from './api';

export const createTemplate = async (templateData) => {
  const response = await API.post('/templates', templateData);
  return response.data;
};

export const getTemplates = async () => {
  const response = await API.get('/templates');
  return response.data;
};

export const getTemplateById = async (id) => {
  const response = await API.get(`/templates/${id}`);
  return response.data;
};

export const updateTemplate = async (id, templateData) => {
  const response = await API.put(`/templates/${id}`, templateData);
  return response.data;
};

export const deleteTemplate = async (id) => {
  const response = await API.delete(`/templates/${id}`);
  return response.data;
};
