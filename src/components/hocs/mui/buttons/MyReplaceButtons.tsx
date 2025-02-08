'use client';

import React from 'react';
import {PropertibleProps} from "@/defines/abilities/PropertibleProps.ts";
import MyButton from "@/components/hocs/mui/MyButton.tsx";
import MyReplaceComponents from "@/components/hocs/mui/base/MyReplaceComponent.tsx";
import {ClickableProps} from "@/defines/combines/ClickableProps.ts";


/**
 * ButtonProps defines a button property.
 * @param label
 * @param onClick
 * @param props
 */
interface ButtonProps extends ClickableProps, PropertibleProps {
}

/**
 * Replace buttons component
 * @param buttonA
 * @param buttonB
 * @param showButtonA show button A or B
 * @param onSetShowButtonA callback show button A or B
 */
interface ReplaceButtonsProps {
  buttonA: ButtonProps;
  buttonB: ButtonProps;
  showButtonA: boolean;
  onSetShowButtonA: (show: boolean) => void;
}

const MyReplaceButtons: React.FC<ReplaceButtonsProps> = ({
                                                           buttonA,
                                                           buttonB,
                                                           showButtonA,
                                                           onSetShowButtonA
                                                         }) => {
  const handleButtonA = () => {
    // check params
    if (!buttonA || buttonA.onClick === undefined) {
      throw new Error('[hoc][btn] buttonA and its onClick is not specified.');
    }
    onSetShowButtonA(false);
    buttonA.onClick();
  };

  const handleButtonB = () => {
    // check params
    if (!buttonB || buttonB.onClick === undefined) {
      throw new Error('[hoc][btn] buttonB and its onClick is not specified.');
    }
    onSetShowButtonA(true);
    buttonB.onClick();
  };

  return (
    <MyReplaceComponents
      isShowChildA={showButtonA}
    >
      <MyButton
        label={buttonA.label}
        onClick={handleButtonA}
        {...buttonA.props}
      />
      <MyButton
        label={buttonB.label}
        onClick={handleButtonB}
        {...buttonB.props}
      />
    </MyReplaceComponents>
  );
}

export default MyReplaceButtons;