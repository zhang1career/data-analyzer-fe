'use client';

import React, {useContext, useState} from "react";
import {GridFilterItem, GridRowId} from "@mui/x-data-grid";
import {NEWS_COLUMNS, translateQueryField} from "@/schema/NewsSchema.ts";
import MyDataList from "@/adapter/mui/MyDataList.tsx";
import NewsDetail from "@/clientings/news/NewsDetail.tsx";
import {getNews, searchNewsPage} from "@/clientings/NewsClienting.ts";
import {EMPTY_PAGE} from "@/consts/PaginateConst.ts";
import {NewsVo} from "@/pojo/vos/NewsVo.ts";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import NewsCreate from "@/clientings/news/NewsCreate.tsx";

function handleBuildCondition(originCondition: { [key: string]: any }, item: GridFilterItem): { [key: string]: any } {
  if (item.operator !== 'contains all') {
    throw new Error('Unsupported operator: ' + item.operator);
  }
  const field = translateQueryField(item.field);
  return {...originCondition, [field]: item.value};
}

const NewsList: React.FC = () => {
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
  const [selectedItem, setSelectedItem] = useState<NewsVo | null>(null);

  function clearItem() {
    setSelectedItem(null);
  }

  // item refreshment
  const [activeItemAt, setActiveItemAt] = useState(Date.now());

  function refreshRelation() {
    setActiveItemAt(Date.now());
  }

  // operation - select an item
  const handleClickItem = (item: NewsVo) => {
    setSelectedItem(item);
    refreshRelation();
  };

  // operation - search
  const handleSearch = async (offset: number, count: number, condition?: { [key: string]: string | number }) => {
    // clear item
    clearItem();
    // query
    try {
      return await searchNewsPage(
        routing,
        offset,
        count,
        condition);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('Failed to search news.\n', e.message);
        setError(e);
      } else {
        console.error('Failed to search news.\n', e);
        setError(e);
      }
      return EMPTY_PAGE;
    }
  }

  // operation - detail an item
  const handleDetail = async (newsId: number) => {
    try {
      return await getNews(
        routing,
        newsId);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('Failed to get news.\n', e.message);
        setError(e);
      } else {
        console.error('Failed to get news.\n', e);
        setError(e);
      }
      return null;
    }
  }

  // operation - delete an item
  const handleDelete = async (newsId: GridRowId) => {
    if (typeof newsId === "string") {
      console.warn("[news][delete] invalid rowId:", newsId);
      return;
    }

    try {
      // await deleteNews(
      //   routing,
      //   newsId);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('Failed to delete news.\n', e.message);
        setError(e);
      } else {
        console.error('Failed to delete news.\n', e);
        setError(e);
      }
    }
    return;
  }

  return (
    <div>
      <NewsCreate
        callbackRefresh={refreshSearch}
      />

      <MyDataList
        columns={NEWS_COLUMNS}
        onSearch={handleSearch}
        onBuildCondition={handleBuildCondition}
        onRowDelete={handleDelete}
        onRowClick={(params) => {
          handleClickItem(params.row as NewsVo);
        }}
        componentConfig={{
          filterable: 'toolbar'
        }}
        refreshSearch={activeSearchAt}
        callbackRefreshSearch={refreshSearch}
      />

      {/* detail */}
      {selectedItem && (
        <NewsDetail
          item={selectedItem}
          callbackRefresh={refreshSearch}>
        </NewsDetail>
      )}
    </div>
  );
};

export default NewsList;