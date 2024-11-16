import React, {useEffect, useState} from 'react';
import {useNotifications} from '@toolpad/core/useNotifications';
import MyModal from '@/adapter/mui/MyModal.tsx';

import {Term} from "@/pojo/models/Term.ts";
import MyTextField from "@/adapter/mui/MyTextField.tsx";
import MyEditableForm from "@/adapter/mui/MyEditableForm.tsx";
import {usePathname, useRouter} from "next/navigation";
import {createTerm} from "@/clientings/TermClienting.ts";

const TermCreate: React.FC = () => {
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

  const handleCreate = async () => {
    console.debug('[term][create] param', formData);
    await createTerm(
      {
        router: router,
        protocol: protocol,
        host: host,
        pathname: pathname
      },
      formData);
    // notice
    notifications.show('Term created!', {
      severity: 'success',
      autoHideDuration: 3000,
    });
  };

  return (
    <MyModal title={'Add'}>
      <MyEditableForm initEditable={true} onSetFormData={setFormData} onSave={handleCreate}>
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
    </MyModal>
  );
}

export default TermCreate;