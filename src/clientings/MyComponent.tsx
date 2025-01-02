'use client';

import React, {useState} from 'react';
import NestedThinkingCreate from "@/clientings/thinking/NestedThinkingCreate.tsx";
import {ThinkingModel} from "@/models/ThinkingModel.ts";


interface DemoObject {
}

function MyComponent() {

  // forms
  const [formData, setFormData] = useState<ThinkingModel | null>(null);


  return (
    <NestedThinkingCreate
      formData={formData}
      setFormData={setFormData}
    />
  );
}

export default MyComponent;