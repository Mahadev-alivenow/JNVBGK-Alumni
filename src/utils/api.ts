import axios from 'axios';
import { Alumni, Event, News } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      throw new Error('Server is not responding. Please try again later.');
    } else {
      throw new Error('Request failed. Please check your connection.');
    }
  }
);

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData: Partial<Alumni>) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Event endpoints
export const getEvents = async () => {
  const response = await api.get('/events');
  return response.data;
};

export const createEvent = async (eventData: Partial<Event>) => {
  const response = await api.post('/events', eventData);
  return response.data;
};

export const updateEvent = async (id: string, eventData: Partial<Event>) => {
  const response = await api.put(`/events/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id: string) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};

// News endpoints
export const getNews = async () => {
  const response = await api.get('/news');
  return response.data;
};

export const createNews = async (newsData: Partial<News>) => {
  const response = await api.post('/news', newsData);
  return response.data;
};

export const updateNews = async (id: string, newsData: Partial<News>) => {
  const response = await api.put(`/news/${id}`, newsData);
  return response.data;
};

export const deleteNews = async (id: string) => {
  const response = await api.delete(`/news/${id}`);
  return response.data;
};

// Alumni endpoints
export const getAlumni = async () => {
  const response = await api.get('/alumni');
  return response.data;
};

export const updateProfile = async (formData: FormData) => {
  const response = await api.put('/alumni/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export default api;