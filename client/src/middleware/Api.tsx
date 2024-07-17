import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosProgressEvent,
} from 'axios';
import { ServerUrl } from '../config/ServerUrl';
import CookieService from '../service/CookiesService';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiResponse {
  data: any;
  success?: boolean;
  message?: string;
  tokenExpired?: boolean;
}

interface ApiError extends Error {
  response?: {
    data?: {
      success?: boolean;
      message?: string;
      error?: string;
    };
  };
}

export const api = async (
  url: string,
  method: HttpMethod,
  headers: Record<string, string> = {},
  data: Record<string, any> = {},
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<ApiResponse> => {
  try {
    const accessToken = CookieService.get('xx_tgk');

    const requestHeaders = {
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
      ...headers,
    };

    const config: AxiosRequestConfig = {
      method,
      url: ServerUrl + url,
      data,
      headers: requestHeaders,
      onUploadProgress,
    };

    const response: AxiosResponse<ApiResponse> = await axios(config);

    return response.data;

  } catch (error) {
    const err = error as ApiError;

    if (err.response?.data?.message === 'Token expired') {

      document.cookie = 'xx_tgk=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
      window.location.href = '/auth';
    }

    const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
    const errorResponse: ApiResponse = {
      data: null,
      success: false,
      message: errorMessage,
    };

    throw errorResponse;
  }
};
