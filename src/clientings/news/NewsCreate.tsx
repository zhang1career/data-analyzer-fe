'use client';

import React, {useContext, useEffect, useState} from 'react';
import MuiModal from '@/components/hocs/mui/modals/MuiModal.tsx';
import MuiTextField from '@/components/hocs/mui/inputs/MuiTextField.tsx';
import MuiEditableForm from '@/components/hocs/mui/forms/MuiEditableForm.tsx';
import {createNews} from '@/io/NewsIO.ts';
import {buildEmptyNews, NewsModel} from '@/models/NewsModel.ts';
import {RoutingContext} from '@/components/providers/RoutingProvider.tsx';
import {NoticingContext} from '@/components/providers/NoticingProvider.tsx';
import {modelToDto} from '@/mappers/NewsMapper.ts';
import {MyAutoCompleteTextField} from '@/components/hocs/mui/MyAutoCompleteTextField.tsx';
import {searchSimilarTagNameList} from "@/io/TagIO.ts";
import {getCachedData, setCachedData} from "@/utils/CacheUtil.ts";
import DateField from "@/components/gears/input/DateField.tsx";
import {setFormField} from "@/defines/combines/FormRWProps.ts";
import {NOTICE_TTL_LONG} from "@/consts/Notice.ts";


interface NewsCreateProps {
  callbackRefresh?: () => void;
}

const NewsCreate: React.FC<NewsCreateProps> = ({
                                                 callbackRefresh
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
  const [formData, setFormData] = useState<NewsModel | null>(null);

  // init
  const initFormData = () => {
    setFormData(getCachedData('inputs-news_form', buildEmptyNews, {ttl: 3600}));
  }

  // operation - create
  const handleCreate = async () => {
    if (!formData) {
      console.warn('[news][create][skip] formData is null');
      return;
    }
    console.debug('[news][create] param', formData);
    // cache
    const newsForm = {
      ...buildEmptyNews(),
      url: formData.url,
      published_at: formData.published_at,
    } as NewsModel;
    setCachedData('inputs-news_form', newsForm, {ttl: 3600});
    // create
    try {
      await createNews(
        routing,
        modelToDto(formData));
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError('News creating failed. ' + e.message);
      } else {
        setError('News creating failed. Unknown reason.');
      }
      return;
    }
    // notice
    noticing('News created!', {
      severity: 'success',
      autoHideDuration: 3000,
    });
    // callback
    if (callbackRefresh) {
      callbackRefresh();
    }
  };

  return (
    <MuiModal
      label={'Add'}
      onClick={initFormData}
      onClose={() => {}}
    >
      <MuiEditableForm
        initEditable={true}
        initFormData={buildEmptyNews()}
        onSetFormData={setFormData}
        onSave={handleCreate}
      >
        <MuiTextField
          id={'content'}
          label={'content'}
          name={'content'}
          value={formData?.['content']}
          required={true}
          multiline
          rows={4}
          variant="outlined"
          fullWidth
        />
        <MuiTextField
          id={'url'}
          label={'url'}
          name={'url'}
          value={formData?.['url']}
          required={true}
        />
        <DateField
          label={'Published At'}
          name={'published_at'}
          value={formData?.['published_at']}
          onChange={(value) => {
            setFormField(setFormData, 'published_at', value);
          }}
        />
        <MyAutoCompleteTextField
          id={'tags'}
          label={'tags'}
          placeholder={'tags'}
          initOptions={formData ? formData['tags'] : []}
          value={formData ? formData['tags'] : []}
          onSetValues={(value) => {
            setFormField(setFormData, 'tags', value);
          }}
          onSearch={searchSimilarTagNameList}
          sx={{width: '100%'}}
        />
      </MuiEditableForm>
    </MuiModal>
  );
}

export default NewsCreate;