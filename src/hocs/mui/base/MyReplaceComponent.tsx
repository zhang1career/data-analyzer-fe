'use client';

import React, {FC, ReactElement} from 'react';
import {Box} from "@mui/material";
import {DerivableProps} from "@/defines/abilities/DerivableProps.ts";


/**
 * In-place replaceable component
 * @param isShowChildA show child A or B
 * @param children the children components
 */
interface ReplaceComponentsProps extends DerivableProps<ReactElement[]> {
  isShowChildA: boolean;
}

const MyReplaceComponent: FC<ReplaceComponentsProps> = ({
                                                          isShowChildA,
                                                          children = [],
                                                        }) => {
  const [childA, childB] = children as ReactElement[];

  return (
    <Box>
      {isShowChildA ? childA : childB}
    </Box>
  );
}

export default MyReplaceComponent;