'use client';

import React, {useContext, useEffect, useState} from "react";
import MyEditableForm from "@/components/hocs/mui/MyEditableForm.tsx";
import MyTextField from "@/components/hocs/mui/input/MyTextField.tsx";
import {updateNews} from "@/io/NewsIO.ts";
import {buildEmptyNews, News} from "@/models/News.ts";
import {NewsVo} from "@/pojo/vo/NewsVo.ts";
import {NoticingContext} from "@/components/providers/NoticingProvider.tsx";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {modelToDto, voToModel} from "@/mappers/NewsMapper.ts";
import {searchSimilarTagNameList} from "@/io/TagIO.ts";
import {MyAutocompleteTextField} from "@/components/hocs/mui/MyAutocompleteTextField.tsx";
import {DerivableProps} from "@/defines/abilities/DerivableProps.ts";
import DateField from "@/components/gears/input/DateField.tsx";

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

  // form
  const [formData, setFormData] = useState<News>(buildEmptyNews());

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
    <>
      <MyEditableForm
        onSetFormData={setFormData}
        onSave={handleSave}
        isVerbose={true}
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
        <DateField
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

      {React.Children.map(children, (child) => {
        return React.cloneElement(child as React.ReactElement, {formData: formData});
      })}
    </>
  );
}

export default NewsDetail;

