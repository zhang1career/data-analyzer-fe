'use client';

import React, {useContext, useEffect, useState} from "react";
import MuiEditableForm from "@/components/hocs/mui/forms/MuiEditableForm.tsx";
import MuiTextField from "@/components/hocs/mui/inputs/MuiTextField.tsx";
import {updateTag} from "@/io/TagIO.ts";
import {buildEmptyTagModel, TagModel} from "@/models/TagModel.ts";
import {NoticingContext} from "@/components/providers/NoticingProvider.tsx";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {List, ListItem} from "@mui/material";
import {NOTICE_TTL_LONG} from "@/consts/Notice.ts";

interface TagDetailProps {
  item: TagModel;
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

  // error
  const [error, setError] = useState<string | null>(null);
  // notice error
  useEffect(() => {
    if (!error) {
      return;
    }
    noticing(error, {
      severity: 'error',
      autoHideDuration: NOTICE_TTL_LONG,
    });
  }, [error, noticing]);

  // forms
  const [formData, setFormData] = useState<TagModel>(buildEmptyTagModel());

  // editable forms refreshment
  const [activeEditableFormAt, setActiveEditableFormAt] = useState<number>(Date.now());

  useEffect(() => {
    setFormData(item);
    setActiveEditableFormAt(Date.now());
  }, [item]);

  // operation - save
  const handleSave = async () => {
    console.debug('[tag][update] param', formData);
    try {
      await updateTag(
        routing,
        item.id,
        formData);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError('Tag getting failed. ' + e.message);
      } else {
        setError('Tag getting failed. Unknown reason.');
      }
      return;
    }
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
    <>
      <div>
        <MuiEditableForm
          onSetFormData={setFormData}
          onSave={handleSave}
          sxButton={{ml: "auto"}}
          key={activeEditableFormAt}
        >
          <MuiTextField
            id="outlined-controlled"
            label="id"
            name="id"
            value={formData['id'] ?? 0}
            isReadOnly={true}
          />
          <MuiTextField
            id="outlined-controlled"
            label="name"
            name="name"
            value={formData['name']}
          />
        </MuiEditableForm>
      </div>
      <div>
        {formData['news'] && (
          <List>
            {formData['news'].map((news) => (
              <ListItem key={news}>
                <p>{news}</p>
              </ListItem>
            ))}
          </List>
        )}
      </div>
      {children}
    </>
  );
}

export default TagDetail;

