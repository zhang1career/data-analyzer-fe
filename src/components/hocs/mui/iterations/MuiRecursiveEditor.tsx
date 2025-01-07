import React from "react";
import {Box, Card, CardContent,} from "@mui/material";
import {Add, Delete} from "@mui/icons-material";
import {FormROProps} from "@/defines/abilities/FormROProps.ts";
import {FormWOPropsBeta} from "@/defines/abilities/FormWOPropsBeta.ts";
import {DerivableProps} from "@/defines/abilities/DerivableProps.ts";
import {setupChildren} from "@/defines/combines/NestableProps.ts";
import {StyledMuiCautiousIconButton, StyledMuiIconButton} from "@/components/styled/buttons/StyledMuiIconButton.tsx";
import {StyledMuiNoPaddingCardContent} from "@/components/styled/cards/StyledMuiCardContent.tsx";


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
    <Card sx={{marginBottom: 0}}>
      <StyledMuiNoPaddingCardContent sx={{paddingLeft: 2, paddingRight: 0, paddingTop: 0.25, paddingBottom: 0.25}}>
        <Box sx={{display: "flex", flexDirection: "column", rowGap: 0.25}}>
          <Box sx={{display: "flex", alignItems: "center", columnGap: 1}}>
            {setupChildren(children, {
              path: path,
              data: data,
              formData: formData,
              setFormData: setFormData,
            })}
            <StyledMuiIconButton onClick={() => onAddChild(path)}>
              <Add/>
            </StyledMuiIconButton>
            <StyledMuiCautiousIconButton onClick={() => onRemoveChild(path)}>
              <Delete/>
            </StyledMuiCautiousIconButton>
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
      </StyledMuiNoPaddingCardContent>
    </Card>
  );
};

export default MuiRecursiveEditor;