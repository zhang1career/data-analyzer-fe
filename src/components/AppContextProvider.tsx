import React, {FC, ReactNode} from "react";
import {ProvidersComposer} from "@/utils/ComponentUtil.tsx";
import NoticingProvider from "@/components/providers/NoticingProvider.tsx";
import RoutingProvider from "@/components/providers/RoutingProvider.tsx";

interface AppContextProviderProps {
  children?: ReactNode;
}

const AppContextProvider: FC<AppContextProviderProps> = ({
                                                           children
                                                         }) => {
  return (
    <ProvidersComposer
      contextProviders={[
        <RoutingProvider key="routing"/>,
        <NoticingProvider key="notice"/>,
      ]}
    >
      {children}
    </ProvidersComposer>
  );
}
export default AppContextProvider;


