import {ThinkingResultVo} from "@/pojo/vo/ThinkingResultVo.ts";
import React from "react";
import {List, ListItem} from "@mui/material";
import Typography from "@mui/material/Typography";
import {FormROProps} from "@/defines/abilities/FormROProps.ts";
import Box from "@mui/material/Box";


interface ThinkingResultProps extends FormROProps<{ [key: string]: ThinkingResultVo }> {
}

const ThinkingResult: React.FC<ThinkingResultProps> = ({
                                                         formData,
                                                       }) => {
  if (!formData) {
    return null;
  }

  return (
    <List>
      {Object.entries(formData).map(([_title, _vo]) => (
        <ListItem key={_title}>
          <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
            <Typography>{_title}:</Typography>
            <Box sx={{display: "flex", flexDirection: "row", gap: 2}}>
              <Typography>{_vo.news_id}</Typography>
              <Typography>{_vo.content}</Typography>
              <Typography>{JSON.stringify(_vo.trace)}</Typography>
              <Typography>{_vo.score}</Typography>
            </Box>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default ThinkingResult;