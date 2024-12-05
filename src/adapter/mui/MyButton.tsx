'use client';

import React from 'react';
import {Button} from '@mui/material';
import {MyClickableProps} from "@/adapter/defines/MyClickableProps.ts";


/**
 * ButtonProps defines a button property.
 * @param label
 * @param onClick
 * @param props
 */
interface ButtonProps extends MyClickableProps {
}

const MyButton: React.FC<ButtonProps> = ({
                                           label,
                                           onClick,
                                           ...rest
                                         }) => {
  return (
    <Button
      onClick={onClick}
      {...rest}
    >
      {label}
    </Button>
  );
}

export default MyButton;
