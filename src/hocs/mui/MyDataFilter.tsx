import {GridSlots, GridToolbarContainer, GridToolbarFilterButton} from "@mui/x-data-grid";
import * as React from "react";


interface CustomToolbarProps {
  setFilterButtonEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}

function CustomToolbar({setFilterButtonEl}: CustomToolbarProps) {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton ref={setFilterButtonEl}/>
    </GridToolbarContainer>
  );
}

const MyDataFilter = () => {

  const [filterButtonEl, setFilterButtonEl] =
    React.useState<HTMLButtonElement | null>(null);

  return {
    slots: {
      toolbar: CustomToolbar as GridSlots['toolbar'],
    },
    slotProps: {
      panel: {
        anchorEl: filterButtonEl,
      },
      toolbar: {
        setFilterButtonEl,
      },
    }
  };
}

export default MyDataFilter;