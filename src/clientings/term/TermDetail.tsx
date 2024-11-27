'use client';

import React, {useContext, useEffect, useState} from "react";
import MyEditableForm from "@/adapter/mui/MyEditableForm.tsx";
import MyTextField from "@/adapter/mui/MyTextField.tsx";
import {updateTerm} from "@/client_io/TermIO.ts";
import {Term} from "@/models/Term.ts";
import {TermVo} from "@/pojo/vos/TermVo.ts";
import {NoticingContext} from "@/components/providers/NoticingProvider.tsx";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {voToModel} from "@/mapper/TermMapper.ts";

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
  const [formData, setFormData] = useState<Term>({
    id: 0,
    name: '',
    content: '',
    relation: [],
  });

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

