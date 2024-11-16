import React, {useEffect, useState} from "react";

import {usePathname, useRouter} from "next/navigation";
import MyEditableForm from "@/adapter/mui/MyEditableForm.tsx";
import MyTextField from "@/adapter/mui/MyTextField.tsx";
import {updateTerm} from "@/clientings/TermClienting.ts";
import {termVoToModel} from "@/repo/TermRepo.ts";
import {Term} from "@/pojo/models/Term.ts";
import {TermVo} from "@/pojo/vos/TermVo.ts";
import {useNotifications} from "@toolpad/core/useNotifications";

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
  // protocol, host
  const [protocol, setProtocol] = useState('');
  const [host, setHost] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setProtocol(window.location.protocol);
      setHost(window.location.host);
    }
  }, []);

  // pathname
  const pathname = usePathname();

  // router
  const router = useRouter();

  // notice
  const notifications = useNotifications();

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
    setFormData(termVoToModel(item));
    setActiveEditableFormAt(Date.now());
  }, [item]);

  // operation - save
  const handleSave = async () => {
    console.debug('[term][update] param', formData);
    await updateTerm(
      {
        router: router,
        protocol: protocol,
        host: host,
        pathname: pathname
      },
      item.id,
      formData);
    // notice
    notifications.show('Term created!', {
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
        btnSx={{ml: "auto"}}
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

