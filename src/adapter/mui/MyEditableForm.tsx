'use client';

import * as React from "react";
import {Dispatch, SetStateAction, useState} from "react";
import MyReplaceButtons from "@/adapter/mui/MyReplaceButtons.tsx";

interface EditableFormProps<T> {
  initEditable?: boolean;
  onSetFormData: Dispatch<SetStateAction<T>>;
  onSave?: () => void;
  onClose?: () => void;
  btnSx?: object;
  children?: React.ReactNode;
}

/**
 * Editable form component
 * @param initEditable the initial editable status
 * @param onSetFormData
 * @param onSave
 * @param onClose
 * @param btnSx
 * @param children the form fields, properties will be passed to children as following:
 *   onChange
 *   isEditable
 * @constructor
 */

function MyEditableForm<T>({
                             initEditable = false,
                             onSetFormData,
                             onSave,
                             onClose,
                             btnSx,
                             children
                           }: EditableFormProps<T>) {
  const [isEditable, setEditable] = useState(initEditable);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSetFormData((prevObject) => ({...prevObject, [event.target.name]: event.target.value}));
  };

  const handleEdit = () => {
    setEditable(true);
  };

  const handleSave = () => {
    setEditable(false);
    if (onSave) {
      onSave();
    }
    if (onClose) {
      onClose();
    }
  };

  // prepare data
  const buttonAProps: object = {
    text: 'Edit',
    onClick: handleEdit
  };
  const buttonBProps: object = {
    text: 'Save',
    onClick: handleSave,
  };
  if (btnSx) {
    Object.assign(buttonAProps, { sx: btnSx });
    Object.assign(buttonAProps, { sx: btnSx });
  }

  return (
    <>
      <MyReplaceButtons
        buttonA={buttonAProps}
        buttonB={buttonBProps}
        initButtonA={!initEditable}
      />

      {React.Children.map(children, (child) => {
        return React.cloneElement(child as React.ReactElement, {onChange: handleChange, isEditable});
      })}
    </>
  );
}

export default MyEditableForm;