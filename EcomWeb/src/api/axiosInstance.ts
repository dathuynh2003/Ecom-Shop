import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { store } from '../app/store';
import { clearTokens, setTokens } from '../features/auth/slices/authSlice';
import type { TokenResponseApiResponse } from './client/models/TokenResponseApiResponse';
import type { TokenRequest } from './client/models/TokenRequest';
import { AuthenticationsService } from './client/services/AuthenticationsService';

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
  config: InternalAxiosRequestConfig;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      if (token && p.config.headers) {
        p.config.headers.Authorization = `Bearer ${token}`;
      }
      p.resolve(p.config);
    }
  });
  failedQueue = [];
};

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  withCredentials: false,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      store.dispatch(clearTokens());
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (config) => resolve(axiosInstance(config as InternalAxiosRequestConfig)),
          reject,
          config: originalRequest,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const tokenRequest: TokenRequest = {
        refreshToken,
      };

      // Gọi BE qua OpenAPI service
      const res: TokenResponseApiResponse =
        await AuthenticationsService.postApiV1AuthenticationsRefreshToken(tokenRequest);

      const newAccessToken = res.data?.accessToken ?? '';
      const newRefreshToken = res.data?.refreshToken ?? refreshToken;

      localStorage.setItem('access_token', newAccessToken);
      localStorage.setItem('refresh_token', newRefreshToken);

      store.dispatch(
        setTokens({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        } as any) // tuỳ bạn define TokenResponse trong FE
      );

      processQueue(null, newAccessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      store.dispatch(clearTokens());
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
