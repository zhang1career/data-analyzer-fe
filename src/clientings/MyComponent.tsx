'use client';

import * as React from 'react';
import {useState} from 'react';
import MyEditableForm from "@/adapter/mui/MyEditableForm.tsx";


function MyComponnet() {

  const [formData, setFormData] = useState<''>('');

  const handleSave = () => {
    console.log('saving...')
  }

  return (
    <MyEditableForm
      initEditable={true}
      onSetFormData={setFormData}
      onSave={handleSave}
      isVerbose={true}
      sxButton={{ml: 'auto'}}
    >
      <p>{'qwer'}</p>
      <p>{'asdf'}</p>
      <p>{'zxcv'}</p>
    </MyEditableForm>
  );
}

export default MyComponnet;