'use client';

import React, {useContext, useEffect, useState} from "react";
import {accessGraphVector} from "@/io/TermIO.ts";
import {AccessVectorVo} from "@/pojo/vo/GraphVo.ts";
import {TermRelationMetaModel, TermRelationModel} from "@/models/TermModel.ts";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {NoticingContext} from "@/components/providers/NoticingProvider.tsx";
import {TermRelationOpt} from "@/pojo/opt/TermRelationOpt.ts";
import {accessVectorVoToTermRelationOptList, termRelationModelToString} from "@/mappers/TermMapper.ts";
import MyDropdownList from "@/components/hocs/mui/MyDropdownList.tsx";
import {TEXTBOX_WIDTH_MIN_PX} from "@/lookings/size.ts";
import {FormRWProps} from "@/defines/combines/FormRWProps.ts";
import {EMPTY_STRING} from "@/consts/StrConst.ts";
import {EditableProps} from "@/defines/abilities/EditableProps.ts";


interface TermAccessVectorProps extends EditableProps, FormRWProps<TermRelationModel> {
  rawData: TermRelationMetaModel;
}

const TermAccessVector: React.FC<TermAccessVectorProps> = ({
                                                             rawData,
                                                             isEditable,
                                                             formData,
                                                             setFormData,
                                                           }) => {
  // context
  const routing = useContext(RoutingContext);
  const noticing = useContext(NoticingContext);

  // options
  const [termRelationOpt, setTermRelationOpt] = useState<TermRelationOpt[]>([]);

  useEffect(() => {
    buildAccessOption(rawData);
  }, [rawData]);

  const buildAccessOption = async (relation: TermRelationMetaModel) => {
    const accessVectorVo = await accessGraphVector(
      routing,
      relation['relationType'],
      relation['isReverse']
    ) as AccessVectorVo;
    if (!accessVectorVo) {
      noticing('No Access Found.', {
        severity: 'warning',
        autoHideDuration: 3000,
      });
      return;
    }
    const termRelationOptList = accessVectorVoToTermRelationOptList(accessVectorVo);
    setTermRelationOpt(termRelationOptList);
  }

  function setTermRelation(termRelation: TermRelationModel) {
    setFormData(termRelation);
  }

  return (
    <>
      <MyDropdownList
        isEditable={isEditable}
        id={'term-access-vector-access_vector'}
        label={'access_vector'}
        name={'access_vector'}
        value={!!formData ? termRelationModelToString(formData) : EMPTY_STRING}
        onChange={(e) => {
          const selectingTermRelation = e.target.value;
          const selectingLabel = termRelationModelToString(selectingTermRelation);
          const selected = termRelationOpt.find((opt) => opt.label === selectingLabel);
          if (selected && selected.value) {
            setTermRelation(selected.value);
          }
        }}
        options={termRelationOpt}
        sx={{width: TEXTBOX_WIDTH_MIN_PX}}
      />
      {/*<TermRelation*/}
      {/*  isEditable={false}*/}
      {/*  formData={formData}*/}
      {/*  setFormData={setFormData}*/}
      {/*/>*/}
    </>
  );
}

export default TermAccessVector;