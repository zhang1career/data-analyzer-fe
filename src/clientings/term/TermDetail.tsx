'use client';

import React, {useContext, useEffect, useState} from "react";
import MyEditableForm from "@/adapter/mui/MyEditableForm.tsx";
import MyTextField from "@/adapter/mui/input/MyTextField.tsx";
import {updateTerm} from "@/io/TermIO.ts";
import {buildEmptyTerm, Term} from "@/models/Term.ts";
import {TermVo} from "@/pojo/vo/TermVo.ts";
import {NoticingContext} from "@/components/providers/NoticingProvider.tsx";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {voToModel} from "@/mappers/TermMapper.ts";

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
  const [formData, setFormData] = useState<Term>(buildEmptyTerm());

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
      formData);
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
        sxButton={{ml: "auto"}}
        key={activeEditableFormAt}>
        <MyTextField
          id="outlined-controlled"
          label="id"
          name="id"
          value={formData['id'] ?? 0}
          isReadOnly={true}
        />
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
      </MyEditableForm>
      {children}
    </div>
  );
}

export default TermDetail;

