import React from 'react';
import {ClickableProps} from "@/defines/combines/ClickableProps.ts";
import {ActivableProps} from "@/defines/abilities/ActivableProps.ts";
import {useDelayEffect} from "@/utils/DelayUtil.ts";
import {ButtonOwnProps} from "@mui/material/Button/Button";


interface MuiAutoButtonProps extends ClickableProps, ActivableProps, ButtonOwnProps {
  delayInMilliSeconds?: number;
}

/**
 * MuiAutoButtonProps
 * @param onClick
 * @param activeAt
 * @param setActiveAt
 * @param delayInMilliSeconds
 * @param disabled
 * @constructor
 */
const MuiAutoButton: React.FC<MuiAutoButtonProps> = ({
                                                       onClick,
                                                       activeAt,
                                                       setActiveAt = () => console.debug('MuiAutoButtonProps.setActiveAt is not set'),
                                                       delayInMilliSeconds = 500,
                                                       disabled,
                                                     }) => {
  // auto submit
  useDelayEffect(() => {
    if (disabled) {
      return;
    }
    if (activeAt !== null) {
      onClick();
    }
    setActiveAt(null);
  }, [activeAt, onClick], delayInMilliSeconds);

  return (
    <>
    </>
  );
}

export default MuiAutoButton;