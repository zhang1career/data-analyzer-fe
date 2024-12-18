'use client';

import React from 'react';
import {Button} from '@mui/material';

import {ClickableProps} from "@/defines/combines/ClickableProps.ts";
import {ButtonOwnProps} from "@mui/material/Button/Button";


/**
 * ButtonProps defines a button property.
 * @param label
 * @param onClick
 * @param props
 */
interface ButtonProps extends ClickableProps, ButtonOwnProps {
}

const MyButton: React.FC<ButtonProps> = ({
                                           label,
                                           onClick,
                                           ...rest
                                         }) => {
  return (
    <Button
      {...rest}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

export default MyButton;
