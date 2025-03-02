'use client';

import * as React from 'react';
import {Dispatch, SetStateAction, useState} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import {Stack, SxProps} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import MyReplaceButtons from '@/components/hocs/mui/buttons/MyReplaceButtons.tsx';
import {NestableProps, setupChildren} from "@/defines/combines/NestableProps.ts";
import {VerbosibleProps} from '@/defines/abilities/VerbosibleProps.ts';
import {EMPTY_STRING} from '@/consts/StrConst.ts';
import MyButton from "@/components/hocs/mui/MyButton.tsx";
import {handleFieldChangeByEvent} from "@/defines/combines/NamedValueProps.ts";
import {mainTheme} from "@/lookings/themes/mainTheme.ts";


interface MuiEditableFormProps<T> extends NestableProps, VerbosibleProps {
  initEditable?: boolean;
  initFormData?: T;
  onSetFormData: Dispatch<SetStateAction<T>>; // todo: could change to (newData: T) => void ?
  onSave?: () => void;
  onClose?: () => void;
  sxButton?: SxProps;
}

/**
 * EditableProps forms component
 * @param initEditable the initial editable status
 * @param initFormData the initial forms inputs
 * @param onSetFormData
 * @param onSave
 * @param onClose
 * @param isVerbose
 * @param sxButton
 * @param children the forms fields, properties will be passed to children as following:
 *   onChange
 *   isEditable
 * @constructor
 */
const MuiEditableForm: React.FC<MuiEditableFormProps<any>> = <T, >({
                                                                     initEditable = false,
                                                                     initFormData,
                                                                     onSetFormData,
                                                                     onSave,
                                                                     onClose,
                                                                     isVerbose = false,
                                                                     sxButton,
                                                                     children = []
                                                                   }: MuiEditableFormProps<T>) => {
  // readonly / editable
  const [isEditable, setEditable] = useState(initEditable);

  // forms
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFieldChangeByEvent<T>(event, onSetFormData);
  };

  // edit / save button
  const [showButtonA, setShowButtonA] = useState<boolean>(!initEditable);

  // operation
  // edit
  const handleEdit = () => {
    setEditable(true);
  };
  // save
  const handleSave = () => {
    setEditable(false);
    // save inputs
    if (onSave) {
      onSave();
    }
    // clear forms
    if (initFormData) {
      onSetFormData(initFormData);
    }
    // close modal
    if (onClose) {
      onClose();
    }
  };
  // cancel
  const handleCancel = () => {
    setEditable(false);
    setShowButtonA(true);
  };

  // prepare inputs
  const buttonAProps = {
    label: isVerbose ? 'Edit' : EMPTY_STRING,
    onClick: handleEdit,
    props: {
      startIcon: <EditIcon/>,
    },
  };
  const buttonBProps = {
    label: isVerbose ? 'Save' : EMPTY_STRING,
    onClick: handleSave,
    props: {
      variant: 'contained',
      startIcon: <SaveIcon/>,
    },
  };
  const buttonCProps = {
    label: isVerbose ? 'Cancel' : EMPTY_STRING,
    onClick: handleCancel,
    props: {
      startIcon: <CancelIcon/>,
    },
  };
  if (sxButton) {
    Object.assign(buttonAProps, {sx: sxButton});
    Object.assign(buttonAProps, {sx: sxButton});
  }

  return (
    <ThemeProvider theme={mainTheme}>
      <Stack
        direction='row'
        spacing={{xs: 1, sm: 2}}
        sx={{
          alignItems: 'flex-start',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Stack
          direction='column'
          spacing={0.2}
          sx={{width: '80%'}}
        >
          {setupChildren(children, {
            isEditable: isEditable,
            onChange: handleChange,
          })}
        </Stack>

        <Stack
          direction='column'
          alignItems='flex-start'
          spacing={0.2}
          sx={{width: '16%'}}
        >
          <MyReplaceButtons
            buttonA={buttonAProps}
            buttonB={buttonBProps}
            showButtonA={showButtonA}
            onSetShowButtonA={setShowButtonA}
          />
          {!showButtonA && <MyButton
              label={buttonCProps.label}
              onClick={buttonCProps.onClick}
              {...buttonCProps.props}
          />}
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};

export default MuiEditableForm;