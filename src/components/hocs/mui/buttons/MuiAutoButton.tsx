import React from 'react';
import {ClickableProps} from "@/defines/combines/ClickableProps.ts";
import {ActivableProps} from "@/defines/abilities/ActivableProps.ts";
import {useDelayEffect} from "@/utils/DelayUtil.ts";


interface MuiAutoButtonProps extends ClickableProps, ActivableProps {
}

/**
 * MuiAutoButtonProps
 * @param onClick
 * @param activeAt
 * @param setActiveAt
 * @constructor
 */
const MuiAutoButton: React.FC<MuiAutoButtonProps> = ({
                                                       onClick,
                                                       activeAt,
                                                       setActiveAt = () => console.debug('MuiAutoButtonProps.setActiveAt is not set'),
                                                     }) => {
  // auto submit
  useDelayEffect(() => {
    if (activeAt !== null) {
      onClick();
    }
    setActiveAt(null);
  }, [activeAt, onClick]);

  return (
    <>
    </>
  );
}

export default MuiAutoButton;