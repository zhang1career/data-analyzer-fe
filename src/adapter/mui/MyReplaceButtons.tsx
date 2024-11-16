'use client';

import React, {useState} from 'react';
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
 * @param initButtonA the initial button to show
 * @param buttonA
 * @param buttonB
 */
interface ReplaceButtonsProps {
  initButtonA?: boolean;
  buttonA: ButtonProps;
  buttonB: ButtonProps;
}

const MyReplaceButtons: React.FC<ReplaceButtonsProps> = ({
                                                           initButtonA = true,
                                                           buttonA,
                                                           buttonB
                                                         }) => {
  const [showButtonA, setShowButtonA] = useState(initButtonA);

  const handleButtonA = () => {
    setShowButtonA(false);
    buttonA.onClick();
  };

  const handleButtonB = () => {
    setShowButtonA(true);
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
