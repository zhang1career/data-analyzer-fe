import React, {useEffect, useState} from "react";
import {Box, Button, Drawer} from "@mui/material";
import {ClickableProps} from "@/defines/combines/ClickableProps.ts";
import {CloseableProps} from "@/defines/combines/CloseableProps.ts";
import {DerivableProps} from "@/defines/abilities/DerivableProps.ts";
import AddIcon from "@mui/icons-material/Add";
import {setupChildren} from "@/defines/combines/NestableProps.ts";
import {OpenSesameProps} from "@/defines/abilities/OpenSesameProps.tsx";


/**
 * MuiDrawer Component
 * @param label the label of the modal
 * @param onClick the action when the modal is clicked
 * @param onClose the action when the modal is closed
 * @param children the content of the modal, properties will be passed to children as following:
 *   onClose
 */
interface MuiDrawerProps extends ClickableProps, CloseableProps, OpenSesameProps, DerivableProps {
}

const MuiDrawer: React.FC<MuiDrawerProps> = ({
                                               label,
                                               onClick = () => console.debug('MuiDrawer.onClick is not implemented'),
                                               onClose = () => console.debug('MuiDrawer.onClose is not implemented'),
                                               openSesame,
                                               setOpenSesame,
                                               children
                                             }) => {
  // open/close the drawer
  const [open, setOpen] = useState(false);

  // open handler
  function openDrawer() {
    onClick();
    setOpen(true);
  }

  // close handler
  function closeDrawer() {
    onClose();
    setOpenSesame && setOpenSesame(false);
    setOpen(false);
  }

  // monitor openSesame
  useEffect(() => {
    if (openSesame && !open) {
      openDrawer();
    }
  }, [openSesame, openDrawer]);

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