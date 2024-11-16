'use client';

import * as React from "react";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import MyReplaceButtons from "@/adapter/mui/MyReplaceButtons.tsx";

interface EditableFormProps<T> {
  initEditable?: boolean;
  initFormData?: T;
  onSetFormData: Dispatch<SetStateAction<T>>;
  onSave?: () => void;
  onClose?: () => void;
  btnSx?: object;
  children?: React.ReactNode;
}

/**
 * Editable form component
 * @param initEditable the initial editable status
 * @param initFormData the initial form data
 * @param onSetFormData
 * @param onSave
 * @param onClose
 * @param btnSx
 * @param children the form fields, properties will be passed to children as following:
 *   onChange
 *   isEditable
 * @constructor
 */
const MyEditableForm: React.FC<EditableFormProps<any>> = <T, >({
                                                                 initEditable = false,
                                                                 initFormData,
                                                                 onSetFormData,
                                                                 onSave,
                                                                 onClose,
                                                                 btnSx,
                                                                 children
                                                               }: EditableFormProps<T>) => {
  // readonly / editable
  const [isEditable, setEditable] = useState(initEditable);

  // form
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSetFormData((prevObject) => ({...prevObject, [event.target.name]: event.target.value}));
  };

  // edit / save button
  const [showButtonA, setShowButtonA] = useState(!initEditable);

  // operation
  // edit
  const handleEdit = () => {
    setEditable(true);
  };
  // save
  const handleSave = () => {
    setEditable(false);
    // save data
    if (onSave) {
      onSave();
    }
    // clear form
    if (initFormData) {
      onSetFormData(initFormData);
    }
    // close modal
    if (onClose) {
      onClose();
    }
  };

  // prepare data
  const buttonAProps = {
    text: 'Edit',
    onClick: handleEdit
  };
  const buttonBProps = {
    text: 'Save',
    onClick: handleSave,
  };
  if (btnSx) {
    Object.assign(buttonAProps, {sx: btnSx});
    Object.assign(buttonAProps, {sx: btnSx});
  }

  return (
    <>
      <MyReplaceButtons
        buttonA={buttonAProps}
        buttonB={buttonBProps}
        showButtonA={showButtonA}
        callbackShowButtonA={setShowButtonA}
      />

      {React.Children.map(children, (child) => {
        return React.cloneElement(child as React.ReactElement, {onChange: handleChange, isEditable});
      })}
    </>
  );
}

export default MyEditableForm;