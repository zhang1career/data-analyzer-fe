import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import React, {FC, ReactElement} from "react";
import {DerivableProps} from "@/defines/abilities/DerivableProps.ts";


/**
 * InterruptModalProps
 * @param title the interrupt modal title
 * @param dialog the interrupt modal dialog content
 * @param isOpen the interrupt modal open state
 * @param onClose the interrupt modal close callback
 * @param children the interrupt modal children, e.g. buttons
 */
interface InterruptModalProps extends DerivableProps<ReactElement[]> {
  title: string;
  dialog: string;
  isOpen: boolean;
  onClose: () => void;
}

const MyInterruptModal: FC<InterruptModalProps> = ({
                                                     title,
                                                     dialog,
                                                     isOpen,
                                                     onClose,
                                                     children = [],
                                                   }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {dialog}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {children}
      </DialogActions>
    </Dialog>
  );
}

export default MyInterruptModal;