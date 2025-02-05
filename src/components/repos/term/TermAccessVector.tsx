'use client';

import React, {useContext, useEffect, useState} from "react";
import {accessGraphVector} from "@/io/TermIO.ts";
import {AccessVectorVo} from "@/pojo/vo/GraphVo.ts";
import {TermRelationMetaModel} from "@/models/TermModel.ts";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {NoticingContext} from "@/components/providers/NoticingProvider.tsx";
import {accessVectorVoToTermRelationOptList} from "@/mappers/TermMapper.ts";
import MuiDropdownList from "@/components/hocs/mui/inputs/MuiDropdownList.tsx";
import {WIDTH_MIN_PX} from "@/lookings/size.ts";
import {FormRWProps} from "@/defines/combines/FormRWProps.ts";
import {EMPTY_STRING} from "@/consts/StrConst.ts";
import {EditableProps} from "@/defines/abilities/EditableProps.ts";
import {LabeledValueProps} from "@/defines/combines/LabeledValueProps.ts";
import {TermRelationOpt} from "@/pojo/opt/TermRelationOpt.ts";


interface TermAccessVectorProps extends EditableProps, FormRWProps<TermRelationOpt> {
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
  const [termRelationOpt, setTermRelationOpt] = useState<LabeledValueProps<string>[]>([]);

  useEffect(() => {
    buildAccessOption(rawData);
  }, [rawData]);

  const buildAccessOption = async (relation: TermRelationMetaModel) => {
    let accessVectorVo;
    try {
      accessVectorVo = await accessGraphVector(
        routing,
        relation['relationType'],
        relation['isReverse']
      ) as AccessVectorVo;
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('Failed to get term.\n', e.message);
      } else {
        console.error('Failed to get term.\n', e);
      }
      return;
    }
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


  return (
    <>
      <MuiDropdownList
        isEditable={isEditable}
        id={'term-access-vector-access_vector'}
        label={'access_vector'}
        name={'access_vector'}
        value={formData ? JSON.stringify(formData) : EMPTY_STRING}
        onChange={(event) => {
          setFormData(JSON.parse(event.target.value));
        }}
        options={termRelationOpt}
        sx={{width: WIDTH_MIN_PX}}
      />
    </>
  );
}

export default TermAccessVector;