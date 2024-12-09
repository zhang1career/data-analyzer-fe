'use client';

import React, {useContext, useState} from 'react';
import MyModal from '@/adapter/mui/MyModal.tsx';
import MyTextField from '@/adapter/mui/MyTextField.tsx';
import MyEditableForm from '@/adapter/mui/MyEditableForm.tsx';
import {createNews} from '@/io/NewsIO.ts';
import {buildEmptyNews, News} from '@/models/News.ts';
import {RoutingContext} from '@/components/providers/RoutingProvider.tsx';
import {NoticingContext} from '@/components/providers/NoticingProvider.tsx';
import {modelToDto} from '@/mappers/NewsMapper.ts';
import {MyAutocompleteTextField} from '@/adapter/mui/MyAutocompleteTextField.tsx';
import {searchSimilarTagNameList} from "@/io/TagIO.ts";
import {getCachedData, setCachedData} from "@/utils/CacheUtil.ts";
import DateInput from "@/components/biz/input/DateInput.tsx";


interface NewsCreateProps {
  callbackRefresh?: () => void;
}

const NewsCreate: React.FC<NewsCreateProps> = ({
                                                 callbackRefresh
                                               }) => {
  // context
  const routing = useContext(RoutingContext);
  const noticing = useContext(NoticingContext);

  // form
  const [formData, setFormData] = useState<News>(getCachedData('data-news_form', buildEmptyNews, {ttl: 3600}));

  // operation - create
  const handleCreate = async () => {
    console.debug('[news][create] param', formData);
    // cache
    const newsForm = {
      ...buildEmptyNews(),
      url: formData.url,
      published_at: formData.published_at,
    } as News;
    setCachedData('data-news_form', newsForm, {ttl: 3600});
    // create
    await createNews(
      routing,
      modelToDto(formData));
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
    <MyModal title={'Add'}>
      <MyEditableForm
        initEditable={true}
        initFormData={buildEmptyNews()}
        onSetFormData={setFormData}
        onSave={handleCreate}>
        <MyTextField
          id={'content'}
          label={'content'}
          name={'content'}
          value={formData['content']}
          required={true}
          multiline
          rows={4}
          variant="outlined"
          fullWidth
        />
        <MyTextField
          id={'url'}
          label={'url'}
          name={'url'}
          value={formData['url']}
          required={true}
        />
        {/*<MyTextField*/}
        {/*  id={'published_at'}*/}
        {/*  label={'published_at'}*/}
        {/*  name={'published_at'}*/}
        {/*  value={formData['published_at']}*/}
        {/*  required={true}*/}
        {/*/>*/}
        <DateInput
          id={'published_at'}
          label={'Published At'}
          name={'published_at'}
          value={formData['published_at']}
          onChange={(value) => {
            setFormData((prevObject) => ({...prevObject, ['published_at']: value}));
          }}
        />
        <MyAutocompleteTextField
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
      </MyEditableForm>
    </MyModal>
  );
}

export default NewsCreate;