'use client';

import React, {useContext, useEffect, useState} from 'react';
import MuiModal from '@/components/hocs/mui/modals/MuiModal.tsx';
import MuiTextField from "@/components/hocs/mui/inputs/MuiTextField.tsx";
import MuiEditableForm from "@/components/hocs/mui/forms/MuiEditableForm.tsx";
import {createTerm} from "@/io/TermIO.ts";
import {buildEmptyTermModel, TermModel, TermRelationModel} from "@/models/TermModel.ts";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {NoticingContext} from "@/components/providers/NoticingProvider.tsx";
import {
  checkRelationBlank,
  getTrimmedRelationValue,
  TermRelation,
  TermRelationExtProps
} from "@/components/repos/term/TermRelation.tsx";
import {withListEditor} from "@/components/hocs/mui/iterations/MyListEditor.tsx";
import {setFormField} from "@/defines/combines/FormRWProps.ts";
import {NOTICE_TTL_LONG} from "@/consts/Notice.ts";


interface TermCreateProps {
  callbackRefresh?: () => void;
}

const TermCreate: React.FC<TermCreateProps> = ({
                                                 callbackRefresh
                                               }) => {
  // context
  const routing = useContext(RoutingContext);
  const noticing = useContext(NoticingContext);

  // error
  const [error, setError] = useState<string | null>(null);
  // notice error
  useEffect(() => {
    if (!error) {
      return;
    }
    noticing(error, {
      severity: 'error',
      autoHideDuration: NOTICE_TTL_LONG,
    });
  }, [error, noticing]);

  // forms
  const [formData, setFormData] = useState<TermModel | null>(null);

  // operation - create
  const handleCreate = async () => {
    if (!formData) {
      console.warn('[term][create][skip] formData is null');
      return;
    }
    console.debug('[term][create] param', formData);
    try {
      await createTerm(
        routing,
        formData);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError('Term creating failed. ' + e.message);
      } else {
        setError('Term creating failed. Unknown error');
      }
      return;
    }
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
    <MuiModal
      label={'Add'}
      onClick={() => {
      }}
      onClose={() => {
      }}
    >
      <MuiEditableForm
        initEditable={true}
        initFormData={buildEmptyTermModel()}
        onSetFormData={setFormData}
        onSave={handleCreate}>
        <MuiTextField
          id="outlined-controlled"
          label="name"
          name="name"
          value={formData?.['name']}
        />
        <MuiTextField
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
      </MuiEditableForm>
    </MuiModal>
  );
}

// term relation component
const TermRelationList = withListEditor<TermRelationModel, TermRelationExtProps>(TermRelation);


export default TermCreate;