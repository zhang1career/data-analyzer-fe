import NextAuth, {User} from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type {Provider} from 'next-auth/providers';
import {LoginFuncType, LoginQo, UserPlus} from '@/models/UserPlus.ts';
import {Login} from '@/sdks/fusio/Consumer';
import {saveAccess} from "@/app/server_models/Access.ts";
import {PATH_SIGNIN} from "@/consts/UrlConst.ts";

const providers: Provider[] = [
  Credentials({
    name: 'Custom',
    credentials: {
      email: {label: 'Email Address', type: 'email'},
      password: {label: 'Password', type: 'password'},
    },
    async authorize(credentials, request) {
      const userPlus: UserPlus = await Login({
        username: String(credentials.email),
        password: String(credentials.password),
        activeAt: Date.now(),
      });
      if (!userPlus) {
        return null;
      }

      saveAccess(userPlus);

      const user: User = {
        id: String(userPlus.id),
        name: userPlus.name,
        email: String(credentials.email),
      }
      return user;
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
    signIn: PATH_SIGNIN,
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
