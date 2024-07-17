import axios from 'axios';
import { ServerUrl } from '../config/ServerUrl';
import CookieService from './CookiesService';

const expiresAt = 60 * 24; // Expires in 24 hours

interface CookieOptions {
  path: string;
  expires?: Date;
  httpOnly: boolean;
  secure: boolean;
}

class AuthService {
  async postRequest(endpoint: string, data: any) {
    try {
      const response = await axios.post(`${ServerUrl}/${endpoint}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  handleLoginSuccess(response: any, remember: boolean, dispatch: any) {
    const options: CookieOptions = {
      path: '/',
      httpOnly: false,
      secure: false,
    };
    
    if (remember) {
      const date = new Date();
      date.setTime(date.getTime() + expiresAt * 60 * 1000);
      options.expires = date;
    }

    const session = response.data.token;

    CookieService.set('xx_tgk', session, options);

    dispatch({ type: 'LOGIN', payload: session });

    return true;
  }
}

export default new AuthService();
