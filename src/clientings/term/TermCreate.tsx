'use client';

import React, {useContext, useState} from 'react';
import MyModal from '@/hocs/mui/MyModal.tsx';
import MyTextField from "@/hocs/mui/input/MyTextField.tsx";
import MyEditableForm from "@/hocs/mui/MyEditableForm.tsx";
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
import {withListEditor} from "@/hocs/mui/list/MyListEditor.tsx";

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
  const [formData, setFormData] = useState<TermModel>(buildEmptyTermModel());

  // form.relation
  function setFormDataRelation(relation: TermRelationModel[]) {
    setFormData(prevState => ({
      ...prevState,
      relation: relation
    }));
  }

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
        initFormData={buildEmptyTermModel()}
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
        <TermRelationList
          formData={formData.relation}
          setFormData={setFormDataRelation}
          checkBlank={checkRelationBlank}
          getTrimmedValue={getTrimmedRelationValue}
        />
      </MyEditableForm>
    </MyModal>
  );
}

// term relation component
const TermRelationList = withListEditor<TermRelationModel, TermRelationExtProps>(TermRelation);


export default TermCreate;