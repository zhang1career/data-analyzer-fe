import React, {useState} from "react";
import {buildEmptyThinking, ThinkingModel} from "@/models/ThinkingModel.ts";
import {Box, Typography} from "@mui/material";
import Thinking from "@/components/repos/thinking/Thinking.tsx";
import MuiRecursiveEditor from "@/components/hocs/mui/iterations/MuiRecursiveEditor.tsx";

import {addChild, removeChild} from "@/defines/combines/NestableProps.ts";


interface NestedThinkingCreateProps {
}

const NestedThinkingCreate: React.FC<NestedThinkingCreateProps> = () => {
  //
  const [formData, setFormData] = useState<ThinkingModel | null>(buildEmptyThinking());

  const handleAddChild = (path: number[]) => {
    const updatedData = addChild(formData, path, buildEmptyThinking());
    setFormData(updatedData);
  };

  const handleRemoveChild = (path: number[]) => {
    const updatedData = removeChild(formData, path);
    setFormData(updatedData);
  };

  return (
    <Box sx={{padding: 2}}>
      <Typography variant="h5">Thinking Editor</Typography>
      <MuiRecursiveEditor
        path={[]}
        data={formData}
        formData={formData}
        setFormData={setFormData}
        onAddChild={handleAddChild}
        onRemoveChild={handleRemoveChild}
      >
        <Thinking/>
      </MuiRecursiveEditor>
      <Box mt={3}>
        <Typography variant="h6">Generated Structure:</Typography>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </Box>
    </Box>
  );
};

export default NestedThinkingCreate;