import React from 'react';
import {ClickableProps} from "@/defines/combines/ClickableProps.ts";
import {DerivableProps} from "@/defines/abilities/DerivableProps.ts";
import {setupChildren} from "@/defines/combines/NestableProps.ts";


interface MuiButtonProps extends ClickableProps, DerivableProps {
}

/**
 * MuiAutoButtonProps
 * @param onClick
 * @param children
 * @param rest
 * @constructor
 */
const MuiButton: React.FC<MuiButtonProps> = ({
                                               onClick,
                                               children,
                                             }) => {
  return (
    <>
      {setupChildren(children, {
        onClick: onClick
      })}
    </>
  );
}

export default MuiButton;