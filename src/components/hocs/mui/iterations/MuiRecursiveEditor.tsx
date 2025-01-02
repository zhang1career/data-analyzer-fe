import React from "react";
import {Box, Card, CardContent, IconButton,} from "@mui/material";
import {Add, Delete} from "@mui/icons-material";
import {FormROProps} from "@/defines/abilities/FormROProps.ts";
import {FormWOPropsBeta} from "@/defines/abilities/FormWOPropsBeta.ts";
import {DerivableProps} from "@/defines/abilities/DerivableProps.ts";
import {setupChildren} from "@/defines/combines/NestableProps.ts";


interface MuiRecursiveEditorProps<T extends DerivableProps<T[]>> extends FormROProps<T>, FormWOPropsBeta<T>, DerivableProps {
  path: number[];
  data: T | null;  // current child
  onAddChild: (path: number[]) => void;
  onRemoveChild: (path: number[]) => void;
}

const MuiRecursiveEditor: React.FC<MuiRecursiveEditorProps<any>> = <T extends DerivableProps<T[]>, >({
                                                                                                       path,
                                                                                                       data,
                                                                                                       formData,
                                                                                                       setFormData,
                                                                                                       onAddChild,
                                                                                                       onRemoveChild,
                                                                                                       children,
                                                                                                     }: MuiRecursiveEditorProps<T>) => {
  return (
    <Card sx={{marginBottom: 2}}>
      <CardContent>
        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
          <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
            {setupChildren(children, {
              path: path,
              data: data,
              formData: formData,
              setFormData: setFormData,
            })}
            <IconButton
              color="primary"
              onClick={() => onAddChild(path)}
            >
              <Add/>
            </IconButton>
            <IconButton
              color="error"
              onClick={() => onRemoveChild(path)}
            >
              <Delete/>
            </IconButton>
          </Box>
          {data?.children?.map((_child, _index) => (
            <MuiRecursiveEditor
              path={[...path, _index]}
              data={_child}
              formData={formData}
              setFormData={setFormData}
              onAddChild={onAddChild}
              onRemoveChild={onRemoveChild}
              key={_index}
            >
              {setupChildren(children, {})}
            </MuiRecursiveEditor>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MuiRecursiveEditor;