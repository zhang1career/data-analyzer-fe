import React, {FC, ReactElement, ReactNode} from 'react';

export interface ProvidersComposerProps {
  contextProviders: ReactElement[];
  children?: ReactNode;
}

export const ProvidersComposer: FC<ProvidersComposerProps> = ({contextProviders, children}) => {
  return contextProviders.reduceRight((children, parent) =>
    React.cloneElement(parent, {children}), children
  );
};