import React from 'react';
import clsx from 'clsx';
import {css, styled} from '@mui/system';
import {Modal as BaseModal} from '@mui/base/Modal';
import {Box, Button} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {GREY} from "@/lookings/color.ts";
import {setupChildren} from "@/defines/combines/NestableProps.ts";
import {DerivableProps} from "@/defines/abilities/DerivableProps.ts";
import {ClickableProps} from "@/defines/combines/ClickableProps.ts";
import {CloseableProps} from "@/defines/combines/CloseableProps.ts";

/**
 * MuiModal Component
 * @param label the label of the modal
 * @param onClick the action when the modal is clicked
 * @param onClose the action when the modal is closed
 * @param children the content of the modal, properties will be passed to children as following:
 *   onClose
 */
interface MuiModalProps extends ClickableProps, CloseableProps, DerivableProps {
}

const MuiModal: React.FC<MuiModalProps> = ({
                                             label,
                                             onClick = () => console.debug('MuiModal.onClick is not implemented'),
                                             onClose = () => console.debug('MuiModal.onClose is not implemented'),
                                             children
                                           }) => {

  const [open, setOpen] = React.useState(false);

  const openModal = () => {
    onClick();
    setOpen(true);
  }

  const closeModal = () => {
    onClose();
    setOpen(false);
  }


  return (
    <>
      <Box
        display="flex"
        justifyContent="flex-end"
      >
        <Button
          onClick={openModal}
          startIcon={<AddIcon/>}
        >
          {label}
        </Button>
      </Box>

      <Modal
        open={open}
        onClose={closeModal}
        slots={{backdrop: StyledBackdrop}}
      >
        <ModalContent sx={{width: '50%'}}>
          {setupChildren(children, {
            onClose: closeModal,
          })}
        </ModalContent>
      </Modal>
    </>
  );
}

const Backdrop = React.forwardRef<
  HTMLDivElement,
  { open?: boolean; className: string }
>((props, ref) => {
  const {open, className, ...other} = props;
  return (
    <div
      className={clsx({'base-Backdrop-open': open}, className)}
      ref={ref}
      {...other}
    />
  );
});

const Modal = styled(BaseModal)`
    position: fixed;
    z-index: 1300;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const StyledBackdrop = styled(Backdrop)`
    z-index: -1;
    position: fixed;
    inset: 0;
    background-color: rgb(0 0 0 / 0.5);
    -webkit-tap-highlight-color: transparent;
`;

const ModalContent = styled('div')(
  ({theme}) => css`
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: 500;
      text-align: start;
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow: hidden;
      background-color: ${theme.palette.mode === 'dark' ? GREY[900] : '#fff'};
      border-radius: 8px;
      border: 1px solid ${theme.palette.mode === 'dark' ? GREY[700] : GREY[200]};
      box-shadow: 0 4px 12px ${theme.palette.mode === 'dark' ? 'rgb(0 0 0 / 0.5)' : 'rgb(0 0 0 / 0.2)'};
      padding: 24px;
      color: ${theme.palette.mode === 'dark' ? GREY[50] : GREY[900]};

      & .modal-title {
          margin: 0;
          line-height: 1.5rem;
          margin-bottom: 8px;
      }

      & .modal-description {
          margin: 0;
          line-height: 1.5rem;
          font-weight: 400;
          color: ${theme.palette.mode === 'dark' ? GREY[400] : GREY[800]};
          margin-bottom: 4px;
      }
  `,
);

export default MuiModal;