'use client';

import * as React from "react";
import {Grid2} from "@mui/material";
import {width_1_of_3, width_2_of_3, size_full} from "@/lookings/size.ts";

const MyComponnet: React.FC = () => {

  return (
    <Grid2 container>
      <Grid2 size={width_2_of_3}>
        {'2 of 3'}
      </Grid2>

      <Grid2 size={width_1_of_3}>
        {'1 of 3'}

        <div>
          <Grid2 container>
            <Grid2 size={size_full}>
              {'3 of 3'}
            </Grid2>
          </Grid2>
        </div>
      </Grid2>
    </Grid2>
  )
}

export default MyComponnet;