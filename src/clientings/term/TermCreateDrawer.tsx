import React, {useContext, useEffect, useState} from "react";
import {buildEmptyTermModel, TermModel, TermRelationModel} from "@/models/TermModel.ts";
import MuiDrawer from "@/components/hocs/mui/modals/MuiDrawer.tsx";
import MyEditableForm from "@/components/hocs/mui/MyEditableForm.tsx";
import MyTextField from "@/components/hocs/mui/input/MyTextField.tsx";
import {setFormField} from "@/defines/combines/FormRWProps.ts";
import {
  checkRelationBlank,
  getTrimmedRelationValue,
  TermRelation,
  TermRelationExtProps
} from "@/components/repos/term/TermRelation.tsx";
import {withListEditor} from "@/components/hocs/mui/list/MyListEditor.tsx";
import {createTerm} from "@/io/TermIO.ts";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {NoticingContext} from "@/components/providers/NoticingProvider.tsx";


interface TermCreateDrawerProps {
  termName: string;
  termRelation?: TermRelationModel | null;
  callbackRefresh?: () => void;
}

const TermCreateDrawer: React.FC<TermCreateDrawerProps> = ({
                                                             termName,
                                                             termRelation,
                                                             callbackRefresh
                                                           }) => {
  // context
  const routing = useContext(RoutingContext);
  const noticing = useContext(NoticingContext);

  // form
  const [formData, setFormData] = useState<TermModel | null>(null);
  // set term
  useEffect(() => {
    setFormField(setFormData, 'name', termName);
  }, [termName]);
  // set relations
  useEffect(() => {
    setFormField(setFormData, 'relation', termRelation ? [termRelation] : []);
  }, [termRelation]);


  // operation - create
  const handleCreate = async () => {
    if (!formData) {
      console.warn('[term][create][skip] formData is null');
      return;
    }
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
          setFormData={(relation) => {
            console.log('[debug] relation:', relation);
            setFormField(setFormData, 'relation', relation);
          }}
          checkBlank={checkRelationBlank}
          getTrimmedValue={getTrimmedRelationValue}
        />
      </MyEditableForm>
    </MuiDrawer>
  );
}

// term relation component
const TermRelationList = withListEditor<TermRelationModel, TermRelationExtProps>(TermRelation);

export default TermCreateDrawer;