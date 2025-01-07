import React, {useContext, useEffect, useState} from "react";
import {TermRelationModel} from "@/models/TermModel.ts";
import MuiTextField from "@/components/hocs/mui/inputs/MuiTextField.tsx";
import MuiFieldGroup from "@/components/hocs/mui/inputs/MuiFieldGroup.tsx";
import {EditableProps} from "@/defines/abilities/EditableProps.ts";
import DirectionDropdownList from "@/components/gears/input/DirectionDropdownList.tsx";
import {FormRWProps} from "@/defines/combines/FormRWProps.ts";
import MuiDropdownList from "@/components/hocs/mui/inputs/MuiDropdownList.tsx";
import {EMPTY_STRING} from "@/consts/StrConst.ts";
import {WIDTH_120_PX} from "@/lookings/size.ts";
import {LabeledValueProps} from "@/defines/combines/LabeledValueProps.ts";
import {getMiscDict} from "@/io/MiscIO.ts";
import {DICT_SPEECH_ALL} from "@/consts/Misc.ts";
import {DictVo} from "@/pojo/vo/misc/DictVo.ts";
import {dictVoToOptBatch} from "@/mappers/misc/DictMapper.ts";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";


interface TermRelationProps extends EditableProps, FormRWProps<TermRelationModel> {
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

  // options
  const [relationTypeOpts, setRelationTypeOpts] = useState<LabeledValueProps<string>[] | null>(null);
  // init options
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
    <MuiFieldGroup
      isEditable={isEditable}
      onSetFormData={(_setFormField) => {
        const _newFormData = _setFormField(formData);
        setFormData(_newFormData)
      }}
      direction='row'
      spacing={0.2}
      sx={{width: '80%'}}
    >
      <MuiTextField
        id="term-relation-id"
        label="id"
        name="id"
        value={formData?.['id'] ?? 0}
        isReadOnly={true}
      />
      <MuiDropdownList
        id={'term-relation-relation_type'}
        label={'relationType'}
        name={'relationType'}
        value={formData ? formData['relationType'] : EMPTY_STRING}
        options={relationTypeOpts}
        sx={{width: WIDTH_120_PX}}
      />
      <DirectionDropdownList
        id="term-relation-is_reverse"
        label="isReverse"
        name="isReverse"
        value={formData?.['isReverse'] ?? false}
      />
      <MuiTextField
        id="term-relation-name"
        label="destName"
        name="destName"
        value={formData?.['destName'] ?? ''}
      />
    </MuiFieldGroup>
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