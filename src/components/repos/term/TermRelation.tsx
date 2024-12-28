import React, {useContext, useEffect, useState} from "react";
import {TermRelationModel} from "@/models/TermModel.ts";
import MyTextField from "@/components/hocs/mui/input/MyTextField.tsx";
import MyFieldGroup from "@/components/hocs/mui/input/MyFieldGroup.tsx";
import {EditableProps} from "@/defines/abilities/EditableProps.ts";
import DirectionDropdownList from "@/components/gears/input/DirectionDropdownList.tsx";
import {FormRWProps} from "@/defines/combines/FormRWProps.ts";
import MyDropdownList from "@/components/hocs/mui/MyDropdownList.tsx";
import {EMPTY_STRING} from "@/consts/StrConst.ts";
import {TEXTBOX_WIDTH_120_PX} from "@/lookings/size.ts";
import {LabeledValueProps} from "@/defines/combines/LabeledValueProps.ts";
import {getMiscDict} from "@/io/MiscIO.ts";
import {DICT_SPEECH_ALL} from "@/consts/Misc.ts";
import {DictVo} from "@/pojo/vo/misc/DictVo.ts";
import {dictVoToOptBatch} from "@/mappers/misc/DictMapper.ts";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";


interface TermRelationProps extends FormRWProps<TermRelationModel>, EditableProps {
}

// todo: move EditableProps to TermRelationProps
export interface TermRelationExtProps extends EditableProps {
}

export const TermRelation: React.FC<TermRelationProps> = ({
                                                            isEditable,
                                                            formData,
                                                            setFormData,
                                                          }) => {
  // context
  const routing = useContext(RoutingContext);

  // graph vector map
  const [relationTypeOpts, setRelationTypeOpts] = useState<LabeledValueProps<string>[] | null>(null);

  useEffect(() => {
    const miscDictPromise = getMiscDict(
      routing,
      [DICT_SPEECH_ALL],
      {});
    miscDictPromise.then((miscDict) => {
      const attrDictVoList = miscDict[DICT_SPEECH_ALL] as DictVo[];
      setRelationTypeOpts(dictVoToOptBatch(attrDictVoList));
    });
  }, [routing]);

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
      <MyDropdownList
        id={'term-relation-relation_type'}
        label={'relation_type'}
        name={'relation_type'}
        value={formData ? formData['relationType'] : EMPTY_STRING}
        options={relationTypeOpts}
        sx={{width: TEXTBOX_WIDTH_120_PX}}
      />
      <DirectionDropdownList
        id="term-relation-is_reverse"
        label="is_reverse"
        name="is_reverse"
        value={formData?.['isReverse'] ?? false}
      />
      <MyTextField
        id="term-relation-name"
        label="name"
        name="name"
        value={formData?.['destName'] ?? ''}
      />
    </MyFieldGroup>
  );
}

export function checkRelationBlank(relation: TermRelationModel | null) {
  return !relation
    || (!relation['destName'] || relation['destName'].trim().length === 0)
    || (!relation['relationType'] || relation['relationType'].trim().length === 0);
}

export function getTrimmedRelationValue(relation: TermRelationModel): TermRelationModel {
  return {
    id: relation.id,
    destId: relation.destId,
    destName: relation.destName,
    relationType: relation.relationType,
    isReverse: relation.isReverse,
    speechType: relation.speechType,
  };
}