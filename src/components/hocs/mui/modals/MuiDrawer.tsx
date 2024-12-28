import React, {useState} from "react";
import {Box, Button, Drawer} from "@mui/material";
import {ClickableProps} from "@/defines/combines/ClickableProps.ts";
import {CloseableProps} from "@/defines/combines/CloseableProps.ts";
import {DerivableProps} from "@/defines/abilities/DerivableProps.ts";
import AddIcon from "@mui/icons-material/Add";
import {setupChildren} from "@/defines/combines/NestableProps.ts";


/**
 * MuiDrawer Component
 * @param label the label of the modal
 * @param onClick the action when the modal is clicked
 * @param onClose the action when the modal is closed
 * @param children the content of the modal, properties will be passed to children as following:
 *   onClose
 */
interface MuiDrawerProps extends ClickableProps, CloseableProps, DerivableProps {
}

const MuiDrawer: React.FC<MuiDrawerProps> = ({
                                               label,
                                               onClick = () => console.debug('MuiDrawer.onClick is not implemented'),
                                               onClose = () => console.debug('MuiDrawer.onClose is not implemented'),
                                               children
                                             }) => {
  const [open, setOpen] = useState(false);

  function openDrawer() {
    onClick();
    setOpen(true);
  }

  function closeDrawer() {
    onClose();
    setOpen(false);
  }


  return (
    <>
      <Button
        onClick={openDrawer}
        startIcon={<AddIcon/>}
        sx={{
          position: "fixed",
          right: 16,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        {label}
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={closeDrawer}
        PaperProps={{
          sx: {
            width: 600,
            height: 'calc(100% - 100px)',
            top: 80,
          },
        }}
      >
        <Box
          sx={{
            padding: 2,
            height: "75%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {setupChildren(children, {
            onClose: closeDrawer,
          })}
        </Box>
      </Drawer>
    </>
  );
};

export default MuiDrawer;