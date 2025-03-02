'use client';

import React, {useContext, useEffect, useState} from "react";
import {Grid2} from "@mui/material";
import {GridFilterItem, GridRowId} from "@mui/x-data-grid";
import {TAG_COLUMNS, translateQueryField} from "@/schema/TagSchema.ts";
import MyDataList from "@/components/hocs/mui/MyDataList.tsx";
import TagDetail from "@/clientings/tag/TagDetail.tsx";
import {searchTagPage, getTag, deleteTag} from "@/io/TagIO.ts";
import {EMPTY_PAGE} from "@/consts/PaginateConst.ts";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {GRID_WIDTH_1_OF_3, GRID_WIDTH_2_OF_3} from "@/lookings/size.ts";
import {voToModel, voToModelBatch} from "@/mappers/TagMapper.ts";
import {Paginate} from "@/models/Paginate.ts";
import {TagModel} from "@/models/TagModel.ts";
import {NoticingContext} from "@/components/providers/NoticingProvider.tsx";
import {NOTICE_TTL_LONG} from "@/consts/Notice.ts";

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

  function refreshSearch() {
    setActiveSearchAt(Date.now());
  }

  // item selection
  const [selectedItem, setSelectedItem] = useState<TagModel | null>(null);
  // operation - select an item
  const handleClickItem = (item: TagModel) => {
    setSelectedItem(item);
  };
  // operation - clear an item
  function clearItem() {
    setSelectedItem(null);
  }

  // operation - search
  const handleSearch = async (offset: number, count: number, condition?: { [key: string]: string | number }) => {
    // clear item
    clearItem();
    // query
    try {
      const tagVoPage = await searchTagPage(
        routing,
        offset,
        count,
        condition);
      return {
        data: voToModelBatch(tagVoPage.data),
        total_num: tagVoPage.total_num,
      } as Paginate<TagModel>;
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError('Tag searching failed. ' + e.message);
      } else {
        setError('Tag searching failed. Unknown reason.');
      }
      return EMPTY_PAGE;
    }
  }

  // operation - detail an item
  const handleDetail = async (tagId: number): Promise<TagModel | null> => {
    try {
      const tagVo = await getTag(
        routing,
        tagId);
      return voToModel(tagVo);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError('Tag getting failed. ' + e.message);
      } else {
        setError('Tag getting failed. Unknown reason.');
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
        setError('Tag deleting failed. ' + e.message);
      } else {
        setError('Tag deleting failed. Unknown reason.');
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
          onMappingBatch={(vs: TagModel[]) => vs}
          onRowDelete={handleDelete}
          onRowClick={(params) => {
            handleClickItem(params.row as TagModel);
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