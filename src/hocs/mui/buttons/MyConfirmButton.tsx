'use client';

import React, {FC, useState} from "react";
import {ClickableProps} from "@/defines/combines/ClickableProps.ts";
import MyInterruptModal from "@/hocs/mui/base/MyInterruptModal.tsx";
import MyButton from "@/hocs/mui/MyButton.tsx";
import {ButtonOwnProps} from "@mui/material/Button/Button";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';


/**
 * ConfirmButtonProps
 * @param title the confirm modal title
 * @param label the confirm button label
 * @param onClick the original function to be confirmed
 * @param rest the button props
 */
interface ConfirmButtonProps extends ClickableProps, ButtonOwnProps {
  title: string,
}

const MyConfirmButton: FC<ConfirmButtonProps> = ({
                                                 title,
                                                 label,
                                                 onClick,
                                                 ...rest
                                               }) => {
  // open/close modal
  const [isOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <MyButton
        {...rest}
        label={label}
        onClick={openModal}
      />

      <MyInterruptModal
        title={`Confirm ${title}`}
        dialog={`Are you sure you want to perform ${label}?`}
        isOpen={isOpen}
        onClose={closeModal}
      >
        <MyButton
          label={'Cancel'}
          onClick={closeModal}
          color={'primary'}
          startIcon={<CloseIcon/>}
        />
        <MyButton
          label={'Confirm'}
          onClick={onClick}
          color={'error'}
          variant={'contained'}
          startIcon={<CheckIcon/>}
        />
      </MyInterruptModal>
    </>
  );
}

export default MyConfirmButton;