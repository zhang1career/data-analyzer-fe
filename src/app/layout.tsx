import * as React from 'react';
import {AppProvider} from '@toolpad/core/nextjs';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v14-appRouter';
import {SessionProvider} from 'next-auth/react';
import {auth} from '@/auth';
import {AUTHENTICATION} from "@/configs/Auth";
import {BRANDING} from "@/configs/Branding";
import {NAVIGATION} from "@/configs/Navigator";

export default async function RootLayout(props: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" data-toolpad-color-scheme="light">
    <body>
    <SessionProvider session={session}>
      <AppRouterCacheProvider options={{enableCssLayer: true}}>
        <AppProvider authentication={AUTHENTICATION}
                     session={session}
                     branding={BRANDING}
                     navigation={NAVIGATION}>
          {props.children}
        </AppProvider>
      </AppRouterCacheProvider>
    </SessionProvider>
    </body>
    </html>
  );
}
