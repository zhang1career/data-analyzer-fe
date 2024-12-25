'use client';

import React, {useContext, useEffect, useState} from "react";
import MyEditableForm from "@/hocs/mui/MyEditableForm.tsx";
import MyTextField from "@/hocs/mui/input/MyTextField.tsx";
import {updateTag} from "@/io/TagIO.ts";
import {buildEmptyTag, Tag} from "@/models/Tag.ts";
import {TagVo} from "@/pojo/vo/TagVo.ts";
import {NoticingContext} from "@/components/providers/NoticingProvider.tsx";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {voToModel} from "@/mappers/TagMapper.ts";
import {List, ListItem} from "@mui/material";

interface TagDetailProps {
  item: TagVo;
  callbackRefresh?: () => void;
  children?: React.ReactNode;
}

/**
 * Tag detail component
 * @param item
 * @param callbackRefresh refresh callback
 * @param children
 * @constructor
 */
const TagDetail: React.FC<TagDetailProps> = ({
                                               item,
                                               callbackRefresh,
                                               children = undefined
                                             }) => {
  // context
  const routing = useContext(RoutingContext);
  const noticing = useContext(NoticingContext);

  // form
  const [formData, setFormData] = useState<Tag>(buildEmptyTag());

  // editable form refreshment
  const [activeEditableFormAt, setActiveEditableFormAt] = useState<number>(Date.now());

  useEffect(() => {
    setFormData(voToModel(item));
    setActiveEditableFormAt(Date.now());
  }, [item]);

  // operation - save
  const handleSave = async () => {
    console.debug('[tag][update] param', formData);
    await updateTag(
      routing,
      item.id,
      formData);
    // notice
    noticing('Tag updated!', {
      severity: 'success',
      autoHideDuration: 3000,
    });
    // callback
    if (callbackRefresh) {
      callbackRefresh();
    }
  };

  return (
    <div>
      <MyEditableForm
        onSetFormData={setFormData}
        onSave={handleSave}
        sxButton={{ml: "auto"}}
        key={activeEditableFormAt}
      >
        <MyTextField
          id="outlined-controlled"
          label="id"
          name="id"
          value={formData['id'] ?? 0}
          isReadOnly={true}
        />
        <MyTextField
          id="outlined-controlled"
          label="name"
          name="name"
          value={formData['name']}
        />
        {formData['news'] && (
          <List>
            {formData['news'].map((news) => (
              <ListItem key={news}>
                <p>{news}</p>
              </ListItem>
            ))}
          </List>
        )}
      </MyEditableForm>
      {children}
    </div>
  );
}

export default TagDetail;

