'use client';

import React, {useState} from 'react';
import {withListEditor} from "@/components/hocs/mui/list/MyListEditor.tsx";
import {
  checkRelationBlank,
  getTrimmedRelationValue,
  TermRelation,
  TermRelationExtProps
} from "@/components/repos/term/TermRelation.tsx";
import {buildEmptyTermModel, TermModel, TermRelationModel} from "@/models/TermModel.ts";
import MyEditableForm from "@/components/hocs/mui/MyEditableForm.tsx";
import MyTextField from "@/components/hocs/mui/input/MyTextField.tsx";
import {setFormField} from "@/defines/combines/FormRWProps.ts";
import MuiDrawer from "@/components/hocs/mui/modals/MuiDrawer.tsx";


function MyComponent() {

  // form
  const [formData, setFormData] = useState<TermModel | null>(null);

  // operation - create
  const handleCreate = async () => {
    console.log('[debug] create');
  };

  return (
    <MuiDrawer
      label={'Add'}
      onClick={() => {
      }}
      onClose={() => {
      }}
    >
      <MyEditableForm
        initEditable={true}
        initFormData={buildEmptyTermModel()}
        onSetFormData={setFormData}
        onSave={handleCreate}>
        <MyTextField
          id="outlined-controlled"
          label="name"
          name="name"
          value={formData?.['name']}
        />
        <MyTextField
          id="outlined-controlled"
          label="content"
          name="content"
          value={formData?.['content']}
        />
        <TermRelationList
          formData={formData ? formData.relation : []}
          setFormData={(relation) => setFormField(setFormData, 'relation', relation)}
          checkBlank={checkRelationBlank}
          getTrimmedValue={getTrimmedRelationValue}
        />
      </MyEditableForm>
    </MuiDrawer>
  );
}

// term relation component
const TermRelationList = withListEditor<TermRelationModel, TermRelationExtProps>(TermRelation);

export default MyComponent;