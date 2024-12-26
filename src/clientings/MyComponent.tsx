'use client';

import React, {useState} from 'react';
import {withListEditor} from "@/hocs/mui/list/MyListEditor.tsx";
import {TermRelation} from "@/components/repos/term/TermRelation.tsx";
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
          || (!data['destName'] || data['destName'].trim().length === 0)
          || (!data['relationType'] || data['relationType'].trim().length === 0)}
        getTrimmedValue={(data) => {
          return {
            id: data.id,
            destName: data.destName,
            relationType: data.relationType,
            isReverse: data.isReverse,
          };
        }}
      />
    </div>
  );
}

export default MyComponent;