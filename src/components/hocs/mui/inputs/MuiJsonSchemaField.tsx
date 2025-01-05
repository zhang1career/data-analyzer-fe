import React, {useState} from "react";
import {Box, Card, CardContent, IconButton, TextField, Typography} from "@mui/material";
import {Add, Delete} from "@mui/icons-material";
import {emptyJsonNode, JsonNode, jsonNodeToObject, JsonValue} from "@/defines/structures/Json.ts";
import {addNodeToTree, removeNodeFromTree, updateNodeInTree} from "@/utils/JsonEditUtil.ts";


interface MuiJsonSchemaFieldProps {
}

const MuiJsonSchemaField: React.FC<MuiJsonSchemaFieldProps> = () => {
  const [jsonTree, setJsonTree] = useState<JsonNode[]>([]);

  function addNode(parentPath: number[] = []) {
    const newNode: JsonNode = emptyJsonNode();
    const updatedTree = addNodeToTree(jsonTree, parentPath, newNode);
    setJsonTree(updatedTree);
  }

  const updateNode = (path: number[], key: string, value: JsonValue) => {
    const updatedTree = updateNodeInTree(jsonTree, path, key, value);
    setJsonTree(updatedTree);
  };

  const removeNode = (path: number[]) => {
    const updatedTree = removeNodeFromTree(jsonTree, path);
    setJsonTree(updatedTree);
  };

  return (
    <Box sx={{padding: 2}}>
      <Typography variant="h5">JSON Editor</Typography>
      <IconButton
        color="primary"
        onClick={() => addNode([])}
      >
        <Add/>
      </IconButton>
      <MuiJsonSchemaTreeField
        nodes={jsonTree}
        onAddNode={addNode}
        onUpdateNode={updateNode}
        onRemoveNode={removeNode}
      />
      <Box mt={2}>
        <Typography variant="h6">Generated JSON:</Typography>
        <pre>{JSON.stringify(jsonNodeToObject(jsonTree), null, 2)}</pre>
      </Box>
    </Box>
  );
};


interface MuiJsonSchemaTreeFieldProps {
  nodes: JsonNode[];
  onAddNode: (path: number[]) => void;
  onUpdateNode: (path: number[], key: string, value: JsonValue) => void;
  onRemoveNode: (path: number[]) => void;
  parentPath?: number[];
}

const MuiJsonSchemaTreeField: React.FC<MuiJsonSchemaTreeFieldProps> = ({
                                                                         nodes,
                                                                         onAddNode,
                                                                         onUpdateNode,
                                                                         onRemoveNode,
                                                                         parentPath = [],
                                                                       }) => {
  return (
    <>
      <Box sx={{ml: 2}}>
        {nodes.map((node, index) => {
          const currentPath = [...parentPath, index];
          const isNested = Array.isArray(node.value);

          return (
            <Card key={index} sx={{marginBottom: 2}}>
              <CardContent>
                <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                  <TextField
                    label="Key"
                    value={node.key}
                    onChange={(e) =>
                      onUpdateNode(currentPath, e.target.value, node.value)
                    }
                    size="small"
                  />
                  {!isNested && (
                    <TextField
                      label="Value"
                      value={String(node.value)}
                      onChange={(e) =>
                        onUpdateNode(currentPath, node.key, e.target.value)
                      }
                      size="small"
                    />
                  )}
                  <IconButton
                    color="primary"
                    onClick={() => onAddNode(currentPath)}
                  >
                    <Add/>
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => onRemoveNode(currentPath)}
                  >
                    <Delete/>
                  </IconButton>
                </Box>
                {isNested && (
                  <MuiJsonSchemaTreeField
                    nodes={node.value as JsonNode[]}
                    onAddNode={onAddNode}
                    onUpdateNode={onUpdateNode}
                    onRemoveNode={onRemoveNode}
                    parentPath={currentPath}
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </>
  );
};

export default MuiJsonSchemaField;
