import { cookies } from 'next/headers';
import {User} from '@/models/User';

export const saveLogin = (user: User) => {
  const expireAt = new Date(Date.now() + user.expires_in * 1000);

  const cookiesList = cookies();
  cookiesList.set('access_token', user.token, {expires: expireAt});
  cookiesList.set('refresh_token', user.refresh_token, {expires: expireAt});
  cookiesList.set('scope', user.scope, {expires: expireAt});
};