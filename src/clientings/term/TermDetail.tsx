'use client';

import React, {useContext, useEffect, useState} from "react";
import MyEditableForm from "@/components/hocs/mui/MyEditableForm.tsx";
import MyTextField from "@/components/hocs/mui/input/MyTextField.tsx";
import {withListEditor} from "@/components/hocs/mui/list/MyListEditor.tsx";
import {updateTerm} from "@/io/TermIO.ts";
import {buildEmptyTermModel, TermModel, TermRelationModel} from "@/models/TermModel.ts";
import {NoticingContext} from "@/components/providers/NoticingProvider.tsx";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {modelToDto} from "@/mappers/TermMapper.ts";
import {
  checkRelationBlank,
  getTrimmedRelationValue,
  TermRelation,
  TermRelationExtProps
} from "@/components/repos/term/TermRelation.tsx";
import {List, ListItem} from "@mui/material";
import {searchTagPage} from "@/io/TagIO.ts";
import {voToModelBatch} from "@/mappers/TagMapper.ts";
import MyDataList from "@/components/hocs/mui/MyDataList.tsx";
import {TAG_COLUMNS, TAG_COLUMNS_SIMPLE} from "@/schema/TagSchema.ts";
import {TagModel} from "@/models/TagModel.ts";
import MyDataListRo from "@/components/hocs/mui/MyDataListRo.tsx";


interface TermDetailProps {
  item: TermModel;
  callbackRefresh?: () => void;
  children?: React.ReactNode;
}

/**
 * Term detail component
 * @param item
 * @param callbackRefresh refresh callback
 * @param children
 * @constructor
 */
const TermDetail: React.FC<TermDetailProps> = ({
                                                 item,
                                                 callbackRefresh,
                                                 children = undefined
                                               }) => {
  // context
  const routing = useContext(RoutingContext);
  const noticing = useContext(NoticingContext);

  // form
  const [formData, setFormData] = useState<TermModel>(buildEmptyTermModel());

  // operation - set form.relation
  function setFormDataRelation(relation: TermRelationModel[]) {
    setFormData(prevState => ({
      ...prevState,
      relation: relation
    }));
  }

  // operation - search similar tag list
  const searchTagList = async (term: string) => {
    try {
      const tagVoPage = await searchTagPage(
        routing,
        0,
        20,
        {name: term});
      return voToModelBatch(tagVoPage.data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('Failed to search tags.\n', e.message);
      } else {
        console.error('Failed to search tags.\n', e);
      }
      return [];
    }
  }

  // actives
  // editable form refreshment
  const [activeEditableFormAt, setActiveEditableFormAt] = useState<number>(Date.now());

  // prepare data
  useEffect(() => {
    searchTagList(item.name).then((tagList) => {
      setFormData({
        ...item,
        tagList: tagList
      });
    });
    setActiveEditableFormAt(Date.now());
  }, [item]);

  // operation - save
  const handleSave = async () => {
    console.debug('[term][update] param', formData);
    await updateTerm(
      routing,
      item.id,
      modelToDto(formData));
    // notice
    noticing('Term updated!', {
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
        <MyEditableForm
          onSetFormData={setFormData}
          onSave={handleSave}
          sxButton={{ml: 'auto'}}
          key={activeEditableFormAt}
        >
          <MyTextField
            id='outlined-controlled'
            label='id'
            name='id'
            value={formData['id'] ?? 0}
            isReadOnly={true}
          />
          <MyTextField
            id='outlined-controlled'
            label='name'
            name='name'
            value={formData['name']}
          />
          <MyTextField
            id='outlined-controlled'
            label='content'
            name='content'
            value={formData['content']}
          />
          <TermRelationList
            formData={formData.relation}
            setFormData={setFormDataRelation}
            checkBlank={checkRelationBlank}
            getTrimmedValue={getTrimmedRelationValue}
          />
        </MyEditableForm>
      </div>

      {children}

      <MyDataListRo
        columns={TAG_COLUMNS_SIMPLE}
        formData={formData['tagList']}
      />
    </>
  );
}

// term relation component
const TermRelationList = withListEditor<TermRelationModel, TermRelationExtProps>(TermRelation);


export default TermDetail;