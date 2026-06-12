import api from './axios'

export const createLinkAPI = (data) => api.post('/links', data)
export const getMyLinksAPI = () => api.get('/links/my')
export const getAnalyticsAPI = (linkId) => api.get(`/links/analytics/${linkId}`)
export const getDeviceStatsAPI = (linkId) => api.get(`/links/analytics/${linkId}/devices`)
export const getTopLinksAPI = () => api.get('/links/top')