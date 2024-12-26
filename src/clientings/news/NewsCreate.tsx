'use client';

import React, {useContext, useState} from 'react';
import MyModal from '@/hocs/mui/MyModal.tsx';
import MyTextField from '@/hocs/mui/input/MyTextField.tsx';
import MyEditableForm from '@/hocs/mui/MyEditableForm.tsx';
import {createNews} from '@/io/NewsIO.ts';
import {buildEmptyNews, News} from '@/models/News.ts';
import {RoutingContext} from '@/components/providers/RoutingProvider.tsx';
import {NoticingContext} from '@/components/providers/NoticingProvider.tsx';
import {modelToDto} from '@/mappers/NewsMapper.ts';
import {MyAutocompleteTextField} from '@/hocs/mui/MyAutocompleteTextField.tsx';
import {searchSimilarTagNameList} from "@/io/TagIO.ts";
import {getCachedData, setCachedData} from "@/utils/CacheUtil.ts";
import DateField from "@/components/gears/input/DateField.tsx";
import {setFormField} from "@/defines/combines/FormRWProps.ts";


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
  const [formData, setFormData] = useState<News | null>(null);

  // init
  const initFormData = () => {
    setFormData(getCachedData('input-news_form', buildEmptyNews, {ttl: 3600}));
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
    } as News;
    setCachedData('input-news_form', newsForm, {ttl: 3600});
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
    <MyModal
      label={'Add'}
      onClick={initFormData}
      onClose={() => {}}
    >
      <MyEditableForm
        initEditable={true}
        initFormData={buildEmptyNews()}
        onSetFormData={setFormData}
        onSave={handleCreate}
      >
        <MyTextField
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
        <MyTextField
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
        <MyAutocompleteTextField
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
      </MyEditableForm>
    </MyModal>
  );
}

export default NewsCreate;