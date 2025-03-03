'use client';

import React, {useContext, useEffect, useState} from "react";
import MuiEditableForm from "@/components/hocs/mui/forms/MuiEditableForm.tsx";
import MuiTextField from "@/components/hocs/mui/inputs/MuiTextField.tsx";
import {updateNews} from "@/io/NewsIO.ts";
import {buildEmptyNews, NewsModel} from "@/models/NewsModel.ts";
import {NewsVo} from "@/pojo/vo/NewsVo.ts";
import {NoticingContext} from "@/components/providers/NoticingProvider.tsx";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {modelToDto, voToModel} from "@/mappers/NewsMapper.ts";
import {searchSimilarTagNameList} from "@/io/TagIO.ts";
import {MyAutoCompleteTextField} from "@/components/hocs/mui/MyAutoCompleteTextField.tsx";
import {DerivableProps} from "@/defines/abilities/DerivableProps.ts";
import DateField from "@/components/gears/input/DateField.tsx";
import {NOTICE_TTL_LONG} from "@/consts/Notice.ts";

interface NewsDetailProps extends DerivableProps {
  item: NewsVo;
  callbackRefresh?: () => void;
}

/**
 * News detail component
 * @param item
 * @param callbackRefresh refresh callback
 * @param children
 * @constructor
 */
const NewsDetail: React.FC<NewsDetailProps> = ({
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
  const [formData, setFormData] = useState<NewsModel>(buildEmptyNews());

  // editable forms refreshment
  const [activeEditableFormAt, setActiveEditableFormAt] = useState<number>(Date.now());

  useEffect(() => {
    setFormData(voToModel(item));
    setActiveEditableFormAt(Date.now());
  }, [item]);

  // operation - save
  const handleSave = async () => {
    console.debug('[news][update] param', formData);
    try {
    await updateNews(
      routing,
      item.id,
      modelToDto(formData));
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError('News updating failed. ' + e.message);
      } else {
        setError('News updating failed. Unknown reason.');
      }
      return;
    }
    // notice
    noticing('News updated!', {
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
      <MuiEditableForm
        onSetFormData={setFormData}
        onSave={handleSave}
        isVerbose={true}
        sxButton={{ml: 'auto'}}
        key={activeEditableFormAt}>
        <MuiTextField
          id={'news_id'}
          label={'id'}
          name={'id'}
          value={formData['id'] ?? 0}
          isReadOnly={true}
        />
        <MuiTextField
          id={'content'}
          label={'content'}
          name={'content'}
          value={formData['content']}
          required={true}
          multiline
          rows={4}
          variant={'outlined'}
          fullWidth
        />
        <MuiTextField
          id={'url'}
          label={'url'}
          name={'url'}
          value={formData['url']}
          isReadOnly={true}
        />
        <DateField
          label={'Published At'}
          name={'published_at'}
          value={formData['published_at']}
          onChange={(value) => {
            setFormData((prevObject) => ({...prevObject, ['published_at']: value}));
          }}
        />
        <MyAutoCompleteTextField
          id={'tags'}
          label={'tags'}
          placeholder={'tags'}
          initOptions={formData['tags']}
          value={formData['tags']}
          onSetValues={(value) => {
            setFormData((prevObject) => ({...prevObject, ['tags']: value}));
          }}
          onSearch={searchSimilarTagNameList}
          sx={{width: '100%'}}
        />
      </MuiEditableForm>

      {React.Children.map(children, (child) => {
        return React.cloneElement(child as React.ReactElement, {formData: formData});
      })}
    </>
  );
}

export default NewsDetail;

