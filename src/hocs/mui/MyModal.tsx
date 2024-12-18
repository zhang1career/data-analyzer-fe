import * as React from 'react';
import clsx from 'clsx';
import {css, styled} from '@mui/system';
import {Modal as BaseModal} from '@mui/base/Modal';
import {Box, Button} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {GREY} from "@/lookings/color.ts";

/**
 * Modal component
 * @param title
 * @param children the content of the modal, properties will be passed to children as following:
 *   onClose
 */
interface ModalProps {
  title: string;
  children?: React.ReactNode;
}

const MyModal: React.FC<ModalProps> = ({
                                         title,
                                         children = undefined
                                       }) => {

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }


  return (
    <div>
      <Box
        display="flex"
        justifyContent="flex-end"
      >
        <Button startIcon={<AddIcon/>} onClick={handleOpen}>
          {title}
        </Button>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        slots={{backdrop: StyledBackdrop}}
      >
        <ModalContent sx={{width: 400}}>
          {React.Children.map(children, (child) => {
            return React.cloneElement(child as React.ReactElement, {onClose: handleClose});
          })}
        </ModalContent>
      </Modal>
    </div>
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

export default MyModal;