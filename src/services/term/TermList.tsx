'use client';

import React, {useState} from "react";
import {GridFilterItem} from "@mui/x-data-grid";
import TermCreate from "@/services/term/TermCreate.tsx";
import TermDetail from "@/services/term/TermDetail.tsx";
import TermRelation from "@/services/term/TermRelation.tsx";
import {DeleteTerm, GetTermById, ListTermByCond, QueryFieldMap, Term, TERM_COLUMNS} from "@/models/Term.ts";
import MyDataList from "@/ui-adapter/MyDataList.tsx";

function handleBuildCondition(originCondition: {[key: string]: any}, item: GridFilterItem): {[key: string]: any} {
  if (item.operator !== 'equals') {
    throw new Error('Unsupported operator: ' + item.operator);
  }
  const field = QueryFieldMap(item.field);
  return {...originCondition, [field]: item.value};
}

const TermList: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Term | null>(null);
  const [activeItemAt, setActiveItemAt] = useState(Date.now());

  const handleClickItem = (item: Term) => {
    setSelectedItem(item);
    setActiveItemAt(Date.now());
  };

  return (
    <div>
      <TermCreate/>

      <MyDataList
        columns={TERM_COLUMNS}
        onSearch={ListTermByCond}
        onBuildCondition={handleBuildCondition}
        onRowDelete={(rowId) => () => {
          if (typeof rowId === "string") {
            console.log("Invalid row id:", rowId);
            return;
          }
          DeleteTerm(rowId);
        }}
        onRowClick={(params) => {
          handleClickItem(params.row as Term);
        }}
        componentConfig={{
          filterable: 'toolbar'
        }}
      />

      {/* detail */}
      {selectedItem && (
        <TermDetail item={selectedItem}>
          <TermRelation item={selectedItem} onDetail={GetTermById} key={activeItemAt}/>
        </TermDetail>
      )}
    </div>
  );
};

export default TermList;