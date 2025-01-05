'use client';

import React, {useState} from 'react';
import MuiJsonField from "@/components/hocs/mui/inputs/MuiJsonField.tsx";


function MyComponent() {

  const [formData, setFormData] = useState({
    foo: "bar",
    list: [1, 2, 3],
    nested: {key: "value"},
  });

  function handleSubmit() {
    console.log("Submitted JSON Object:", formData);
  }

  return (
    <>
      <MuiJsonField
        formData={formData}
        setFormData={setFormData}
        label="Submit"
        onClick={handleSubmit}
      >
      </MuiJsonField>
    </>
  );
}

export default MyComponent;