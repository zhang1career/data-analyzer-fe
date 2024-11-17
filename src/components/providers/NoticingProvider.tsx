'use client';

import React, {createContext, FC, ReactNode} from 'react';
import {ShowNotification, useNotifications} from "@toolpad/core/useNotifications";
import DummyError from "@/errors/DummyError.ts";

const dummy: ShowNotification = () => {
  throw new DummyError('[provid][notice] ' + 'Setter failed');
}

export const NoticingContext = createContext(dummy);

interface NoticeProviderProps {
  children?: ReactNode;
}

const NoticingProvider: FC<NoticeProviderProps> = ({
                                                   children
                                                 }) => {

  const notifications = useNotifications();

  console.log('[provid][notice] notifications=', notifications);

  return (
    <NoticingContext.Provider value={notifications.show}>
      {children}
    </NoticingContext.Provider>
  );
}

export default NoticingProvider;