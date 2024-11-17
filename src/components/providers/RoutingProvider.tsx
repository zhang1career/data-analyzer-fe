'use client';

import React, {createContext, FC, ReactNode, useEffect, useState} from 'react';
import {usePathname, useRouter} from "next/navigation";
import DummyError from "@/errors/DummyError.ts";
import {ErrMsg} from "@/consts/MsgConst.ts";
import {MyRouting} from "@/adapter/next/MyRouting.ts";

const dummy: MyRouting = {
  protocol: '',
  host: '',
  router: {
    back: () => {
      throw new DummyError('[provid][router] ' + ErrMsg.SETTER_FAILED);
    },
    forward: () => {
      throw new DummyError('[provid][router] ' + ErrMsg.SETTER_FAILED);
    },
    refresh: () => {
      throw new DummyError('[provid][router] ' + ErrMsg.SETTER_FAILED);
    },
    push: (url: string) => {
      throw new DummyError('[provid][router] ' + ErrMsg.SETTER_FAILED);
    },
    replace: (url: string) => {
      throw new DummyError('[provid][router] ' + ErrMsg.SETTER_FAILED);
    },
    prefetch: (url: string) => {
      throw new DummyError('[provid][router] ' + ErrMsg.SETTER_FAILED);
    }
  },
  pathname: ''
}

export const RoutingContext = createContext(dummy);

interface RoutingProviderProps {
  children?: ReactNode;
}

const RouterProvider: FC<RoutingProviderProps> = ({
                                                    children
                                                  }) => {

  const [routing, setRouting] = useState<MyRouting>({
    protocol: '',
    host: '',
    router: useRouter(),
    pathname: usePathname()
  });

  // url
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRouting({...routing, protocol: window.location.protocol, host: window.location.host});
    }
  }, []);

  useEffect(() => {
    console.log('[provid][pathname] pathname=', routing.pathname);
  }, [routing.pathname]);

  return (
    <RoutingContext.Provider value={routing}>
      {children}
    </RoutingContext.Provider>
  );
}

export default RouterProvider;