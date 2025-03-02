'use client';

import React, {useContext, useEffect, useState} from "react";
import MuiEditableForm from "@/components/hocs/mui/forms/MuiEditableForm.tsx";
import MuiTextField from "@/components/hocs/mui/inputs/MuiTextField.tsx";
import {withListEditor} from "@/components/hocs/mui/iterations/MyListEditor.tsx";
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
import {searchTagPage} from "@/io/TagIO.ts";
import {voToModelBatch} from "@/mappers/TagMapper.ts";
import {TAG_COLUMNS_SIMPLE} from "@/schema/TagSchema.ts";
import MyDataListRo from "@/components/hocs/mui/MyDataListRo.tsx";
import {NOTICE_TTL_LONG, NOTICE_TTL_SHORT} from "@/consts/Notice.ts";


/**
 * Term detail component
 * @param item
 * @param callbackRefresh refresh callback
 * @param children
 */
interface TermDetailProps {
  item: TermModel;
  callbackRefresh?: () => void;
  children?: React.ReactNode;
}

const TermDetail: React.FC<TermDetailProps> = ({
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
  const [formData, setFormData] = useState<TermModel>(buildEmptyTermModel());

  // operation - set forms.relation
  function setFormDataRelation(relation: TermRelationModel[] | null) {
    if (!relation) {
      console.log('[client][term][detail] failed to set formData, relation is null.');
      return;
    }
    setFormData(prevState => ({
      ...prevState,
      relation: relation
    }));
  }

  // operation - search similar tag iterations
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
        setError('Term searching failed. ' + e.message);
      } else {
        setError('Term searching failed. Unknown reason.');
      }
      return [];
    }
  }

  // actives
  // editable forms refreshment
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
    try {
      await updateTerm(
        routing,
        item.id,
        modelToDto(formData));
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError('Term updating failed. ' + e.message);
      } else {
        setError('Term updating failed. Unknown reason.');
      }
      return;
    }
    // notice
    noticing('Term updated!', {
      severity: 'success',
      autoHideDuration: NOTICE_TTL_SHORT,
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
          sxButton={{ml: 'auto'}}
          key={activeEditableFormAt}
        >
          <MuiTextField
            id='outlined-controlled'
            label='id'
            name='id'
            value={formData['id'] ?? 0}
            isReadOnly={true}
          />
          <MuiTextField
            id='outlined-controlled'
            label='name'
            name='name'
            value={formData['name']}
          />
          <MuiTextField
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
        </MuiEditableForm>
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