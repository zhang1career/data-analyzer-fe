import axios from "axios";
import {LoginQo, LoginFuncType, User} from "../../models/User.ts";

interface LoginDto {
  username: string;
  password: string;
}

export const Login: LoginFuncType = async (loginQo: LoginQo) => {
  try {
    const loginDto: LoginDto = {
      username: loginQo.username,
      password: loginQo.password,
    };
    const response = await axios.post('http://www.risk-conquer.com/api-man/consumer/login', loginDto);
    console.log('User login.');
    const user = response.data as User;
    user.id = 0;
    user.name = '';
    user.email = loginQo.username;
    user.image = '';
    return user;
  } catch (error) {
    console.error('Error login:', error);
    throw error;
  }
};