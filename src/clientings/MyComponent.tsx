'use client';

import React, {useState} from 'react';
import MuiJsonField from "@/components/hocs/mui/inputs/MuiJsonField.tsx";


interface DemoObject {
}

function MyComponent() {

  // forms
  const [formData, setFormData] = useState<DemoObject | null>(null);


  return (
    <MuiJsonField
    />
  );
}

export default MyComponent;