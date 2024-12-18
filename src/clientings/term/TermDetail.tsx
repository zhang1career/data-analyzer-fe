'use client';

import React, {useContext, useEffect, useState} from "react";
import MyEditableForm from "@/hocs/mui/MyEditableForm.tsx";
import MyTextField from "@/hocs/mui/input/MyTextField.tsx";
import {withListEditor} from "@/hocs/mui/list/MyListEditor.tsx";
import {updateTerm} from "@/io/TermIO.ts";
import {buildEmptyTermModel, TermModel, TermRelationModel} from "@/models/TermModel.ts";
import {TermVo} from "@/pojo/vo/TermVo.ts";
import {NoticingContext} from "@/components/providers/NoticingProvider.tsx";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {voToModel, modelToDto} from "@/mappers/TermMapper.ts";
import TermRelation from "@/components/repos/term/TermRelation.tsx";


interface TermDetailProps {
  item: TermVo;
  callbackRefresh?: () => void;
  children?: React.ReactNode;
}

/**
 * Term detail component
 * @param item
 * @param callbackRefresh refresh callback
 * @param children
 * @constructor
 */
const TermDetail: React.FC<TermDetailProps> = ({
                                                 item,
                                                 callbackRefresh,
                                                 children = undefined
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

  // editable form refreshment
  const [activeEditableFormAt, setActiveEditableFormAt] = useState<number>(Date.now());

  useEffect(() => {
    setFormData(voToModel(item));
    setActiveEditableFormAt(Date.now());
  }, [item]);

  // operation - save
  const handleSave = async () => {
    console.debug('[term][update] param', formData);
    await updateTerm(
      routing,
      item.id,
      modelToDto(formData));
    // notice
    noticing('Term updated!', {
      severity: 'success',
      autoHideDuration: 3000,
    });
    // callback
    if (callbackRefresh) {
      callbackRefresh();
    }
  };

  return (
    <div>
      <MyEditableForm
        onSetFormData={setFormData}
        onSave={handleSave}
        sxButton={{ml: 'auto'}}
        key={activeEditableFormAt}
      >
        <MyTextField
          id='outlined-controlled'
          label='id'
          name='id'
          value={formData['id'] ?? 0}
          isReadOnly={true}
        />
        <MyTextField
          id='outlined-controlled'
          label='name'
          name='name'
          value={formData['name']}
        />
        <MyTextField
          id='outlined-controlled'
          label='content'
          name='content'
          value={formData['content']}
        />
        <TermRelationList
          formData={formData.relation}
          setFormData={setFormDataRelation}
          checkBlank={checkRelationBlank}
          getTrimmedValue={getTrimmedRelationValue}
        />
      </MyEditableForm>
      {children}
    </div>
  );
}

function checkRelationBlank(relation: TermRelationModel | null) {
  return !relation
    || (!relation['name'] || relation['name'].trim().length === 0)
    || (!relation['relation_type'] || relation['relation_type'].trim().length === 0);
}

function getTrimmedRelationValue(relation: TermRelationModel) {
  return {
    id: relation.id,
    name: relation.name,
    relation_type: relation.relation_type,
    is_reverse: relation.is_reverse,
  };
}

/**
 * Term Relation
 */
// term relation extending props
interface TermRelationExtProps {
  isEditable?: boolean
}

// term relation component
const TermRelationList = withListEditor<TermRelationModel, TermRelationExtProps>(TermRelation);


export default TermDetail;