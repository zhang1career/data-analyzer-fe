'use client';

import * as React from "react";
import {Dispatch, SetStateAction, useState} from "react";
import MyReplaceButtons from "@/adapter/mui/MyReplaceButtons.tsx";
import {Box, Stack, SxProps} from "@mui/material";
import {handleNamedInputChange} from "@/adapter/base/MyNamedInput.ts";

interface EditableFormProps<T> {
  initEditable?: boolean;
  initFormData?: T;
  onSetFormData: Dispatch<SetStateAction<T>>;
  onSave?: () => void;
  onClose?: () => void;
  sxButton?: SxProps;
  children?: React.ReactNode;
}

/**
 * Editable form component
 * @param initEditable the initial editable status
 * @param initFormData the initial form data
 * @param onSetFormData
 * @param onSave
 * @param onClose
 * @param sxButton
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
                                                                 sxButton,
                                                                 children
                                                               }: EditableFormProps<T>) => {
  // readonly / editable
  const [isEditable, setEditable] = useState(initEditable);

  // form
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleNamedInputChange<T>(event, onSetFormData);
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
  if (sxButton) {
    Object.assign(buttonAProps, {sx: sxButton});
    Object.assign(buttonAProps, {sx: sxButton});
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack direction="column" spacing={0.2}>
        {React.Children.map(children, (child) => {
          return React.cloneElement(child as React.ReactElement, {onChange: handleChange, isEditable});
        })}
      </Stack>

      <Box alignItems="flex-start">
        <MyReplaceButtons
          buttonA={buttonAProps}
          buttonB={buttonBProps}
          showButtonA={showButtonA}
          callbackShowButtonA={setShowButtonA}
        />
      </Box>
    </Box>
  );
}

export default MyEditableForm;