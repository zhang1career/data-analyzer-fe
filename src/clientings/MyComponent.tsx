'use client';

import * as React from 'react';
import {useState} from 'react';
import DateInput from "@/components/biz/input/DateField.tsx";
import {buildEmptyNews, News} from "@/models/News.ts";
import MyEditableForm from "@/adapter/mui/MyEditableForm.tsx";
import MyTextField from "@/adapter/mui/input/MyTextField.tsx";


function MyComponent() {
  // form
  const [formData, setFormData] = useState<News>(buildEmptyNews());

  return (
    <>
      <MyEditableForm
        initEditable={true}
        initFormData={buildEmptyNews()}
        onSetFormData={setFormData}
        onSave={() => {
          console.log('saved data:', formData);
        }}>
        <MyTextField
          id={'content'}
          label={'content'}
          name={'content'}
          value={formData['content']}
        />
        <DateInput
          id={'published_at'}
          label={'Published At'}
          name={'published_at'}
          value={formData['published_at']}
          onChange={(value) => {
            setFormData((prevObject) => ({...prevObject, ['published_at']: value}));
          }}
        />
      </MyEditableForm>
    </>
  );
}

export default MyComponent;