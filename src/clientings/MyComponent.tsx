'use client';

import React from "react";
import MyConfirmButton from "@/adapter/mui/buttons/MyConfirmButton.tsx";
import DeleteIcon from '@mui/icons-material/Delete';


const MyComponnet: React.FC = () => {
  const handleDelete = () => {
    console.log("Item deleted");
  };

  return (
    <div>
      <MyConfirmButton
        title={'Delete'}
        label={'delete'}
        onClick={handleDelete}
        startIcon={<DeleteIcon/>}
      />
    </div>
  );
};

export default MyComponnet;
