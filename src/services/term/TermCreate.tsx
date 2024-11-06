import React, {useState} from 'react';
import {useNotifications} from '@toolpad/core/useNotifications';
import {TextField} from '@mui/material';
import {CreateTerm, TermDto} from '@/models/Term.ts';
import MyModal from '@/ui-adapter/MyModal.tsx';
import styles from '@/styles/Form.module.css';

const TermCreate: React.FC = () => {
  const notifications = useNotifications();

  const [formData, setFormData] = useState<TermDto>({
    name: '',
    content: '',
    relation: [],
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevObject) => ({...prevObject, [event.target.name]: event.target.value}));
  };

  const handleCreate = async () => {
    CreateTerm(formData);
    // notice
    notifications.show('Term created!', {
      severity: 'success',
      autoHideDuration: 3000,
    });
  };

  return (
    <MyModal title={'Add'}>
      <header className="modal-card-head">
        <p className="modal-card-title">Create</p>
      </header>
      <section className={styles.formBody}>
        <TextField
          id="outlined-controlled"
          label="name"
          name="name"
          value={formData['name']}
          onChange={handleChange}
        />
        <TextField
          id="outlined-controlled"
          label="content"
          name="content"
          value={formData['content']}
          onChange={handleChange}
        />
      </section>
      <footer className="modal-card-foot">
        <button className="button is-success" onClick={handleCreate}>Save</button>
      </footer>
    </MyModal>
  );
};

export default TermCreate;