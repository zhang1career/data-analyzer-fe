'use client';

import React from "react";
import {TermRelationModel} from "@/models/TermModel.ts";
import MyTextField from "@/hocs/mui/input/MyTextField.tsx";
import MyFieldGroup from "@/hocs/mui/input/MyFieldGroup.tsx";
import {EditableProps} from "@/defines/abilities/EditableProps.ts";
import DirectionDropdownList from "@/components/gears/input/DirectionDropdownList.tsx";
import {FormableProps} from "@/defines/abilities/FormableProps.ts";


interface TermRelationProps extends FormableProps<TermRelationModel>, EditableProps {
}

const TermRelation: React.FC<TermRelationProps> = ({
                                                     isEditable,
                                                     formData,
                                                     setFormData,
                                                   }) => {
  return (
    <MyFieldGroup
      isEditable={isEditable}
      onSetFormData={(_setFormField) => {
        const _newFormData = _setFormField(formData);
        setFormData(_newFormData)
      }}
      direction='row'
      spacing={0.2}
      sx={{width: '80%'}}
    >
      <MyTextField
        id="term-relation-id"
        label="id"
        name="id"
        value={formData?.['id'] ?? 0}
        isReadOnly={true}
      />
      <MyTextField
        id="term-relation-relation_type"
        label="relation_type"
        name="relation_type"
        value={formData?.['relation_type'] ?? ''}
      />
      <DirectionDropdownList
        id="term-relation-is_reverse"
        label="is_reverse"
        name="is_reverse"
        value={formData?.['is_reverse'] ?? false}
      />
      <MyTextField
        id="term-relation-name"
        label="name"
        name="name"
        value={formData?.['name'] ?? ''}
      />
    </MyFieldGroup>
  );
}

export default TermRelation;