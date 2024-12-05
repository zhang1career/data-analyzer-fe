'use client';

import React from 'react';
import {MyClickableProps} from "@/adapter/defines/MyClickableProps.ts";
import {PropertibleProps} from "@/defines/abilities/PropertibleProps.ts";
import MyButton from "@/adapter/mui/MyButton.tsx";


/**
 * ButtonProps defines a button property.
 * @param label
 * @param onClick
 * @param props
 */
interface ButtonProps extends MyClickableProps, PropertibleProps {
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
        <MyButton
          label={buttonA.label}
          onClick={handleButtonA}
          {...buttonA.props}
        />
      ) : (
        <MyButton
          label={buttonB.label}
          onClick={handleButtonB}
          {...buttonB.props}
        />
      )}
    </div>
  );
}

export default MyReplaceButtons;
