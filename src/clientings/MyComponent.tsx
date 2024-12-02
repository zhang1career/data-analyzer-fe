'use client';

import * as React from "react";
import {Grid2} from "@mui/material";
import {GRID_WIDTH_1_OF_3, GRID_WIDTH_2_OF_3, GRID_WIDTH_FULL} from "@/lookings/size.ts";

const MyComponnet: React.FC = () => {

  return (
    <Grid2 container>
      <Grid2 size={GRID_WIDTH_2_OF_3}>
        {'2 of 3'}
      </Grid2>

      <Grid2 size={GRID_WIDTH_1_OF_3}>
        {'1 of 3'}

        <div>
          <Grid2 container>
            <Grid2 size={GRID_WIDTH_FULL}>
              {'3 of 3'}
            </Grid2>
          </Grid2>
        </div>
      </Grid2>
    </Grid2>
  )
}

export default MyComponnet;