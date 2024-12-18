'use client';

import React, {useContext, useState} from 'react';
import MyModal from '@/hocs/mui/MyModal.tsx';
import MyTextField from "@/hocs/mui/input/MyTextField.tsx";
import MyEditableForm from "@/hocs/mui/MyEditableForm.tsx";
import {createTerm} from "@/io/TermIO.ts";
import {TermModel} from "@/models/TermModel.ts";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {NoticingContext} from "@/components/providers/NoticingProvider.tsx";

interface TermCreateProps {
  callbackRefresh?: () => void;
}

const TermCreate: React.FC<TermCreateProps> = ({
                                                 callbackRefresh
                                               }) => {
  // context
  const routing = useContext(RoutingContext);
  const noticing = useContext(NoticingContext);

  // form
  const [formData, setFormData] = useState<TermModel>(buildEmptyFormData());

  // operation - create
  const handleCreate = async () => {
    console.debug('[term][create] param', formData);
    await createTerm(
      routing,
      formData);
    // notice
    noticing('Term created!', {
      severity: 'success',
      autoHideDuration: 3000,
    });
    // callback
    if (callbackRefresh) {
      callbackRefresh();
    }
  };

  return (
    <MyModal title={'Add'}>
      <MyEditableForm
        initEditable={true}
        initFormData={buildEmptyFormData()}
        onSetFormData={setFormData}
        onSave={handleCreate}>
        <MyTextField
          id="outlined-controlled"
          label="name"
          name="name"
          value={formData['name']}
        />
        <MyTextField
          id="outlined-controlled"
          label="content"
          name="content"
          value={formData['content']}
        />
      </MyEditableForm>
    </MyModal>
  );
}

function buildEmptyFormData() {
  return {
    id: 0,
    name: '',
    content: '',
    relation: [],
  }
}

export default TermCreate;