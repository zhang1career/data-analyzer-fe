// todo: rename all models with 'Model' suffix

export interface UserPlus {
  id: number;
  name: string;
  email: string;
  image: string;
  token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface LoginQo {
  username: string;
  password: string;
  activeAt: number;
}

export type LoginFuncType = (loginQo: LoginQo) => Promise<UserPlus>;

export type SaveLoginFuncType = (user: UserPlus) => void;