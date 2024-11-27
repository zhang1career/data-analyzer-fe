'use client';

import React, {useContext, useState} from "react";
import {Grid2} from "@mui/material";
import {GridFilterItem, GridRowId} from "@mui/x-data-grid";
import {TERM_COLUMNS, translateQueryField} from "@/schema/TermSchema.ts";
import MyDataList from "@/adapter/mui/MyDataList.tsx";
import TermCreate from "@/clientings/term/TermCreate.tsx";
import TermDetail from "@/clientings/term/TermDetail.tsx";
import TermRelation from "@/clientings/term/TermRelation.tsx";
import {deleteTerm, getTerm, searchTermPage} from "@/client_io/TermIO.ts";
import {EMPTY_PAGE} from "@/consts/PaginateConst.ts";
import {TermVo} from "@/pojo/vos/TermVo.ts";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {width_1_of_3, width_2_of_3} from "@/lookings/size.ts";

function handleBuildCondition(originCondition: { [key: string]: any }, item: GridFilterItem): { [key: string]: any } {
  if (item.operator !== 'equals') {
    throw new Error('Unsupported operator: ' + item.operator);
  }
  const field = translateQueryField(item.field);
  return {...originCondition, [field]: item.value};
}

const TermList: React.FC = () => {
  // context
  const routing = useContext(RoutingContext);

  // error
  const [error, setError] = useState<any>(null);


  // search refreshment
  const [activeSearchAt, setActiveSearchAt] = useState(Date.now());

  function refreshSearch() {
    setActiveSearchAt(Date.now());
  }

  // item selection
  const [selectedItem, setSelectedItem] = useState<TermVo | null>(null);

  function clearItem() {
    setSelectedItem(null);
  }

  // item refreshment
  const [activeItemAt, setActiveItemAt] = useState(Date.now());

  function refreshRelation() {
    setActiveItemAt(Date.now());
  }

  // operation - select an item
  const handleClickItem = (item: TermVo) => {
    setSelectedItem(item);
    refreshRelation();
  };

  // operation - search
  const handleSearch = async (offset: number, count: number, condition?: { [key: string]: string | number }) => {
    // clear item
    clearItem();
    // query
    try {
      return await searchTermPage(
        routing,
        offset,
        count,
        condition);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('Failed to search terms.\n', e.message);
        setError(e);
      } else {
        console.error('Failed to search terms.\n', e);
        setError(e);
      }
      return EMPTY_PAGE;
    }
  }

  // operation - detail an item
  const handleDetail = async (termId: number) => {
    try {
      return await getTerm(
        routing,
        termId);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('Failed to get term.\n', e.message);
        setError(e);
      } else {
        console.error('Failed to get term.\n', e);
        setError(e);
      }
      return null;
    }
  }

  // operation - delete an item
  const handleDelete = async (termId: GridRowId) => {
    if (typeof termId === "string") {
      console.warn("[term][delete] invalid rowId:", termId);
      return;
    }

    try {
      await deleteTerm(
        routing,
        termId);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('Failed to delete term.\n', e.message);
        setError(e);
      } else {
        console.error('Failed to delete term.\n', e);
        setError(e);
      }
    }
    return;
  }

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={width_1_of_3}>
        <TermCreate
          callbackRefresh={refreshSearch}
        />

        <MyDataList
          columns={TERM_COLUMNS}
          onSearch={handleSearch}
          onBuildCondition={handleBuildCondition}
          onRowDelete={handleDelete}
          onRowClick={(params) => {
            handleClickItem(params.row as TermVo);
          }}
          componentConfig={{
            filterable: 'toolbar'
          }}
          refreshSearch={activeSearchAt}
          callbackRefreshSearch={refreshSearch}
        />
      </Grid2>

      <Grid2 size={width_2_of_3}>
        {/* detail */}
        {selectedItem && (
          <TermDetail
            item={selectedItem}
            callbackRefresh={refreshSearch}>
            <TermRelation item={selectedItem} onDetail={handleDetail} key={activeItemAt}/>
          </TermDetail>
        )}
      </Grid2>
    </Grid2>
  );
};

export default TermList;