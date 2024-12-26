'use client';

import React, {useContext, useEffect, useState} from "react";
import {accessGraphVector} from "@/io/TermIO.ts";
import {AccessVectorVo} from "@/pojo/vo/GraphVo.ts";
import {TermRelationModel} from "@/models/TermModel.ts";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {NoticingContext} from "@/components/providers/NoticingProvider.tsx";
import {TermRelation} from "@/components/repos/term/TermRelation.tsx";
import {TermRelationOpt} from "@/pojo/opt/TermRelationOpt.ts";
import {accessVectorVoToTermRelationOptList, termRelationModelToString} from "@/mappers/TermMapper.ts";
import MyDropdownList from "@/hocs/mui/MyDropdownList.tsx";
import {TEXTBOX_WIDTH_MIN_PX} from "@/lookings/size.ts";


interface TermAccessVectorProps {
  rawData: TermRelationModel;
}

const TermAccessVector: React.FC<TermAccessVectorProps> = ({
                                                             rawData,
                                                           }) => {
  // context
  const routing = useContext(RoutingContext);
  const noticing = useContext(NoticingContext);

  // options
  const [termRelationOpt, setTermRelationOpt] = useState<TermRelationOpt[]>([]);

  useEffect(() => {
    handleAccessOption(rawData);
  }, [rawData]);

  const handleAccessOption = async (dest: TermRelationModel) => {
    const accessVectorVo = await accessGraphVector(
      routing,
      dest['relationType'],
      dest['isReverse']
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

  // selected
  const [termRelation, setTermRelation] = useState<TermRelationModel>({} as TermRelationModel);

  function handleSetTermRelation(termRelation: TermRelationModel) {
    setTermRelation(termRelation);
  }

  return (
    <>
      <MyDropdownList
        id={'term-access-vector-access_vector'}
        label={'access_vector'}
        name={'access_vector'}
        value={termRelationModelToString(termRelation)}
        onChange={(e) => {
          const selectingTermRelation = e.target.value;
          const selectingLabel = termRelationModelToString(selectingTermRelation);
          const selected = termRelationOpt.find((opt) => opt.label === selectingLabel);
          if (selected && selected.value) {
            handleSetTermRelation(selected.value);
          }
        }}
        options={termRelationOpt}
        sx={{width: TEXTBOX_WIDTH_MIN_PX}}
      />
      <TermRelation
        isEditable={false}
        formData={termRelation}
        setFormData={setTermRelation}
      />
    </>
  );
}

export default TermAccessVector;