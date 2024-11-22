'use client';

import React, {useContext, useEffect, useState} from "react";
import MyEditableForm from "@/adapter/mui/MyEditableForm.tsx";
import MyTextField from "@/adapter/mui/MyTextField.tsx";
import {updateNews} from "@/clientings/NewsClienting.ts";
import {News} from "@/models/News.ts";
import {NewsVo} from "@/pojo/vos/NewsVo.ts";
import {NoticingContext} from "@/components/providers/NoticingProvider.tsx";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {modelToDto, voToModel} from "@/mapper/NewsMapper.ts";
import {searchSimilarTagNameList} from "@/clientings/TagClienting.ts";
import {MyAutocompleteTextField} from "@/adapter/mui/MyAutocompleteTextField.tsx";

interface NewsDetailProps {
  item: NewsVo;
  callbackRefresh?: () => void;
  children?: React.ReactNode;
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

  // form
  const [formData, setFormData] = useState<News>(buildEmptyFormData());

  // editable form refreshment
  const [activeEditableFormAt, setActiveEditableFormAt] = useState<number>(Date.now());

  useEffect(() => {
    setFormData(voToModel(item));
    setActiveEditableFormAt(Date.now());
  }, [item]);

  // operation - save
  const handleSave = async () => {
    console.debug('[news][update] param', formData);
    await updateNews(
      routing,
      item.id,
      modelToDto(formData));
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
    <div>
      <MyEditableForm
        onSetFormData={setFormData}
        onSave={handleSave}
        sxButton={{ml: 'auto'}}
        key={activeEditableFormAt}>
        <MyTextField
          id={'news_id'}
          label={'id'}
          name={'id'}
          value={formData['id'] ?? 0}
          isReadOnly={true}
        />
        <MyTextField
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
        <MyTextField
          id={'url'}
          label={'url'}
          name={'url'}
          value={formData['url']}
          isReadOnly={true}
        />
        <MyTextField
          id={'publised_at'}
          label={'published_at'}
          name={'published_at'}
          value={formData['published_at']}
          isReadOnly={true}
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
      {children}
    </div>
  );
}

function buildEmptyFormData(): News {
  return {
    id: 0,
    content: '',
    url: '',
    published_at: '',
    tags: [],
  }
}

export default NewsDetail;

