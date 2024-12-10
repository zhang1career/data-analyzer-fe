'use client';

import React, {useContext, useState} from "react";
import {Grid2} from "@mui/material";
import {GridFilterItem, GridRowId} from "@mui/x-data-grid";
import {TAG_COLUMNS, translateQueryField} from "@/schema/TagSchema.ts";
import MyDataList from "@/adapter/mui/MyDataList.tsx";
import TagDetail from "@/clientings/tag/TagDetail.tsx";
import {searchTagPage, getTag, deleteTag} from "@/io/TagIO.ts";
import {EMPTY_PAGE} from "@/consts/PaginateConst.ts";
import {TagVo} from "@/pojo/vo/TagVo.ts";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {GRID_WIDTH_1_OF_3, GRID_WIDTH_2_OF_3} from "@/lookings/size.ts";
import {deleteTerm} from "@/io/TermIO.ts";

function handleBuildCondition(originCondition: { [key: string]: any }, item: GridFilterItem): { [key: string]: any } {
  if (item.operator !== 'equals') {
    throw new Error('Unsupported operator: ' + item.operator);
  }
  const field = translateQueryField(item.field);
  return {...originCondition, [field]: item.value};
}

const TagList: React.FC = () => {
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
  const [selectedItem, setSelectedItem] = useState<TagVo | null>(null);

  function clearItem() {
    setSelectedItem(null);
  }

  // item refreshment
  const [activeItemAt, setActiveItemAt] = useState(Date.now());

  function refreshRelation() {
    setActiveItemAt(Date.now());
  }

  // operation - select an item
  const handleClickItem = (item: TagVo) => {
    setSelectedItem(item);
    refreshRelation();
  };

  // operation - search
  const handleSearch = async (offset: number, count: number, condition?: { [key: string]: string | number }) => {
    // clear item
    clearItem();
    // query
    try {
      return await searchTagPage(
        routing,
        offset,
        count,
        condition);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('Failed to search tags.\n', e.message);
        setError(e);
      } else {
        console.error('Failed to search tags.\n', e);
        setError(e);
      }
      return EMPTY_PAGE;
    }
  }

  // operation - detail an item
  const handleDetail = async (tagId: number): Promise<TagVo | null> => {
    try {
      return await getTag(
        routing,
        tagId);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('Failed to get tag.\n', e.message);
        setError(e);
      } else {
        console.error('Failed to get tag.\n', e);
        setError(e);
      }
      return null;
    }
  }

  // operation - delete an item
  const handleDelete = async (tagId: GridRowId) => {
    if (typeof tagId === "string") {
      console.warn("[tag][delete] invalid rowId:", tagId);
      return;
    }

    try {
      await deleteTag(
        routing,
        tagId);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('Failed to delete tag.\n', e.message);
        setError(e);
      } else {
        console.error('Failed to delete tag.\n', e);
        setError(e);
      }
    }
    return;
  }

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={GRID_WIDTH_1_OF_3}>
        <MyDataList
          columns={TAG_COLUMNS}
          onSearch={handleSearch}
          onBuildCondition={handleBuildCondition}
          onMappingBatch={(vs: TagVo[]) => vs}
          onRowDelete={handleDelete}
          onRowClick={(params) => {
            handleClickItem(params.row as TagVo);
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
          <TagDetail
            item={selectedItem}
            callbackRefresh={refreshSearch}
          >
          </TagDetail>
        )}
      </Grid2>
    </Grid2>
  );
};

export default TagList;