'use client';

import React from 'react';
import {Button} from '@mui/material';

/**
 * Button component
 * @param text
 * @param onClick
 */
interface ButtonProps {
  text: string;
  onClick: () => void;
}

/**
 * Replace buttons component
 * @param buttonA
 * @param buttonB
 * @param showButtonA show button A or B
 * @param callbackShowButtonA callback show button A or B
 */
interface ReplaceButtonsProps {
  buttonA: ButtonProps;
  buttonB: ButtonProps;
  showButtonA: boolean;
  callbackShowButtonA: (show: boolean) => void;
}

const MyReplaceButtons: React.FC<ReplaceButtonsProps> = ({
                                                           buttonA,
                                                           buttonB,
                                                           showButtonA,
                                                           callbackShowButtonA
                                                         }) => {
  const handleButtonA = () => {
    callbackShowButtonA(false);
    buttonA.onClick();
  };

  const handleButtonB = () => {
    callbackShowButtonA(true);
    buttonB.onClick();
  };

  return (
    <div>
      {showButtonA ? (
        <Button variant="contained" onClick={handleButtonA}>{buttonA.text}</Button>
      ) : (
        <Button variant="contained" onClick={handleButtonB}>{buttonB.text}</Button>
      )}
    </div>
  );
}

export default MyReplaceButtons;
