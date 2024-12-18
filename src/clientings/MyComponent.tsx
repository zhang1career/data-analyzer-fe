'use client';

import React, {useState} from 'react';
import {withListEditor} from "@/hocs/mui/list/MyListEditor.tsx";
import TermRelation from "@/components/repos/term/TermRelation.tsx";
import {TermRelationModel} from "@/models/TermModel.ts";


interface ExtProps {
  isEditable?: boolean
  sx?: any
}

const DemoContentList = withListEditor<TermRelationModel, ExtProps>(TermRelation);

function MyComponent() {

  // list items
  const [itemList, setItemList] = useState<TermRelationModel[] | null>([]);

  return (
    <div>
      <h1>List Editor Example</h1>
      <DemoContentList
        isEditable={true}
        formData={itemList}
        setFormData={setItemList}
        checkBlank={(data) => !data
          || (!data['name'] || data['name'].trim().length === 0)
          || (!data['relation_type'] || data['relation_type'].trim().length === 0)}
        getTrimmedValue={(data) => {
          return {
            id: data.id,
            name: data.name,
            relation_type: data.relation_type,
            is_reverse: data.is_reverse,
          };
        }}
      />
    </div>
  );
}

export default MyComponent;