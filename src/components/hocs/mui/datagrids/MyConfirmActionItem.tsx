import React, {Fragment} from "react";
import {GridActionsCellItem, GridActionsCellItemProps} from "@mui/x-data-grid";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

type ConfirmActionItemProps = GridActionsCellItemProps & {
  dialogTitle: string,
  dialogContent: string,
  onClick: () => void,
}

const MyConfirmActionItem = ({
                               icon,
                               label,
                               dialogTitle,
                               dialogContent,
                               onClick,
                               ...rest
                             }: ConfirmActionItemProps) => {

  const [open, setOpen] = React.useState(false);

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <Fragment>
      <GridActionsCellItem
        icon={icon ?? <Button>{label}</Button>}
        label={label}
        {...rest}
        onClick={() => handleOpen()}
      />
      <Dialog
        open={open}
        onClose={() => handleClose()}
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>Cancel</Button>
          <Button
            onClick={() => {
              handleClose();
              onClick();
            }}
            color="warning"
            autoFocus
          >
            {label}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default MyConfirmActionItem;