'use client';

import React, {useContext, useEffect, useState} from "react";
import {Grid2} from "@mui/material";
import {GridFilterItem, GridRowId} from "@mui/x-data-grid";
import {TERM_COLUMNS, translateQueryField} from "@/schema/TermSchema.ts";
import MyDataList from "@/components/hocs/mui/MyDataList.tsx";
import TermCreate from "@/clientings/term/TermCreate.tsx";
import TermDetail from "@/clientings/term/TermDetail.tsx";
import TermGraph from "@/clientings/term/TermGraph.tsx";
import {deleteTerm, getTerm, searchTermPage} from "@/io/TermIO.ts";
import {EMPTY_PAGE} from "@/consts/PaginateConst.ts";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {GRID_WIDTH_1_OF_3, GRID_WIDTH_2_OF_3} from "@/lookings/size.ts";
import {TermModel} from "@/models/TermModel.ts";
import {voToModel, voToModelBatch} from "@/mappers/TermMapper.ts";
import {Paginate} from "@/models/Paginate.ts";
import {NoticingContext} from "@/components/providers/NoticingProvider.tsx";
import {NOTICE_TTL_LONG} from "@/consts/Notice.ts";

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

  // search refreshment
  const [activeSearchAt, setActiveSearchAt] = useState(Date.now());
  // refresh handler
  function refreshSearch() {
    setActiveSearchAt(Date.now());
  }

  // item selection
  const [selectedItem, setSelectedItem] = useState<TermModel | null>(null);
  // operation - clear an item
  function clearItem() {
    setSelectedItem(null);
  }
  // operation - select an item
  const handleClickItem = (item: TermModel) => {
    setSelectedItem(item);
    refreshRelation();
  };

  // item refreshment
  const [activeItemAt, setActiveItemAt] = useState(Date.now());
  // refresh handler
  function refreshRelation() {
    setActiveItemAt(Date.now());
  }

  // operation - search
  const handleSearch = async (offset: number, count: number, condition?: { [key: string]: string | number }) => {
    // clear item
    clearItem();
    // query
    try {
      const termVoPage = await searchTermPage(
        routing,
        offset,
        count,
        condition);
      return {
        data: voToModelBatch(termVoPage.data),
        total_num: termVoPage.total_num,
      } as Paginate<TermModel>;
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError('Term searching failed. ' + e.message);
      } else {
        setError('Term searching failed. Unknown reason.');
      }
      return EMPTY_PAGE;
    }
  }

  // operation - detail an item
  const handleDetail = async (termId: number): Promise<TermModel | null> => {
    try {
      const termVo = await getTerm(
        routing,
        termId);
      return voToModel(termVo);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError('Term getting failed. ' + e.message);
      } else {
        setError('Term getting failed. Unknown reason.');
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
        setError('Term deleting failed. ' + e.message);
      } else {
        setError('Term deleting failed. Unknown reason.');
      }
    }
    return;
  }

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={GRID_WIDTH_1_OF_3}>
        <TermCreate
          callbackRefresh={refreshSearch}
        />

        <MyDataList
          columns={TERM_COLUMNS}
          onSearch={handleSearch}
          onBuildCondition={handleBuildCondition}
          onMappingBatch={(vs: TermModel[]) => vs}
          onRowDelete={handleDelete}
          onRowClick={(params) => {
            handleClickItem(params.row as TermModel);
          }}
          componentConfig={{
            filterable: 'toolbar'
          }}
          refreshSearch={activeSearchAt}
          callbackRefreshSearch={refreshSearch}
        />
      </Grid2>

      <Grid2 size={GRID_WIDTH_2_OF_3}>
        {/* detail */}
        {selectedItem && (
          <TermDetail
            item={selectedItem}
            callbackRefresh={refreshSearch}
          >
            <TermGraph
              item={selectedItem}
              onDetailNode={handleDetail}
              isNextEnabled={true}
              key={activeItemAt}
            />
          </TermDetail>
        )}
      </Grid2>
    </Grid2>
  );
};

export default TermList;