'use client';

import React from 'react';
import {Button} from '@mui/material';
import {MyClickableProps} from "@/adapter/defines/MyClickableProps.tsx";
import {PropertibleProps} from "@/defines/abilities/PropertibleProps.ts";


/**
 * ButtonProps defines a button property.
 * @param label
 * @param onClick
 * @param props
 */
interface ButtonProps extends MyClickableProps, PropertibleProps {
}

const MyButton: React.FC<ButtonProps> = ({
                                           label,
                                           onClick,
                                           props
                                         }) => {
  return (
    <Button onClick={onClick} {...(props)}>{label}</Button>
  );
}

export default MyButton;
