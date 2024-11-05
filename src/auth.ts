import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type {Provider} from 'next-auth/providers';
import {LoginFuncType, LoginQo, User} from '@/models/User';
import {Login} from '@/sdks/fusio/Consumer';
import {saveLogin} from "@/services/LoginService";

const providers: Provider[] = [
  Credentials({
    name: 'Custom',
    credentials: {
      email: {label: 'Email Address', type: 'email'},
      password: {label: 'Password', type: 'password'},
    },
    async authorize(credentials, request) {
      const user: User = await Login({
        username: String(credentials.email),
        password: String(credentials.password),
        activeAt: Date.now(),
      });
      saveLogin(user);
      return {
        id: user.id,
        name: String(user.name),
        email: String(credentials.email),
      };
    },
  }),
];

export const providerMap = providers.map((provider) => {
  if (typeof provider === 'function') {
    const providerData = provider();
    return {id: providerData.id, name: providerData.name};
  }
  return {id: provider.id, name: provider.name};
});

export const {handlers, auth, signIn, signOut} = NextAuth({
  providers,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    authorized({auth: session, request: {nextUrl}}) {
      const isLoggedIn = !!session?.user;
      const isPublicPage = nextUrl.pathname.startsWith('/public');

      if (isPublicPage || isLoggedIn) {
        return true;
      }

      return false; // Redirect unauthenticated users to login page
    },
  },
});
