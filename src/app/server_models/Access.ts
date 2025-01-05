import {UserPlus} from '@/models/UserPlus.ts';
import {setCookie} from "@/app/server_utils/CookieUtil.ts";
import {ACCESS_SCOPE, ACCESS_TOKEN, REFRESH_TOKEN} from "@/app/server_consts/AccessConst.ts";

export const saveAccess = (user: UserPlus) => {
  const expireAt = new Date(Date.now() + user.expires_in * 1000);
  setCookie(ACCESS_TOKEN, user.token, expireAt);
  setCookie(REFRESH_TOKEN, user.refresh_token, expireAt);
  setCookie(ACCESS_SCOPE, user.scope, expireAt);
};