import * as React from 'react';
import {useEffect, useState} from 'react';
import {DataGrid, GridColDef, GridEventListener, GridFilterItem, GridFilterModel, GridRowId} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import MyDataFilter from "@/adapter/mui/MyDataFilter.tsx";
import {ColumnAction} from "@/adapter/mui/MyDataColumn.tsx";
import {useDelayEffect} from "@/utils/DelayUtil.ts";
import {Paginate} from "@/models/Paginate.ts";

// data type
type DataStateType<T> = {
  isLoading: boolean;
  rows: T[];
  totalRows: number;
  hasNextPage: boolean;
}

// component config
interface ComponentConfig {
  filterable: 'toolbar' | undefined;
}

interface DataTableProps<T> {
  columns: GridColDef[];
  onSearch: (offset: number, count: number, condition?: { [key: string]: string | number }) => Promise<Paginate<T>>;
  onBuildCondition: (originCondition: { [key: string]: any }, item: GridFilterItem) => { [key: string]: any };
  pageSizeOptions?: number[];
  onRowClick?: GridEventListener<'rowClick'>;
  onRowDelete?: (rowId: GridRowId) => void;
  componentConfig?: ComponentConfig;
  // refresh search
  refreshSearch?: number;
  callbackRefreshSearch?: () => void;
}

/**
 * Data list component
 * @param columns
 * @param onSearch
 * @param onBuildCondition
 * @param pageSizeOptions
 * @param onRowDelete
 * @param onRowClick
 * @param componentConfig
 * @param refreshSearch refresh search
 * @param callbackRefreshSearch callback refresh search
 * @constructor
 */
const MyDataList: React.FC<DataTableProps<any>> = <T, >({
                                                          columns,
                                                          onSearch,
                                                          onBuildCondition,
                                                          pageSizeOptions = [10, 20, 50, 100],
                                                          onRowClick = (params, event, detail) => {
                                                            console.log('[adaptr][datalist] row clicked, {params, event, detail}:', {
                                                              params,
                                                              event,
                                                              detail
                                                            });
                                                          },
                                                          onRowDelete = (rowId: GridRowId) => () => {
                                                            console.warn('[adaptr][datalist] onRowDelete not implemented');
                                                          },
                                                          componentConfig = {
                                                            filterable: undefined
                                                          },
                                                          refreshSearch,
                                                          callbackRefreshSearch = () => {
                                                            console.warn('[adaptr][datalist] callbackRefreshSearch not implemented');
                                                          }
                                                        }: DataTableProps<T>) => {
  // filter
  const [filter, setFilter] = useState<GridFilterModel>({items: []});

  // pagination
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
  });

  // data
  const [data, setData] = useState<DataStateType<T>>({
    isLoading: false,
    rows: [],
    totalRows: 0,
    hasNextPage: false
  });

  // avoid the value 'rowCount' becomes undefined during loading
  const rowCountRef = React.useRef(data?.totalRows || 0);
  const rowCount = React.useMemo(() => {
    if (data?.totalRows !== undefined) {
      rowCountRef.current = data.totalRows;
    }
    return rowCountRef.current;
  }, [data?.totalRows]);

  // filter change
  const handleFilterChange = React.useCallback((filterModel: GridFilterModel) => {
    setFilter({...filterModel});
  }, []);
  // typo delay on filter
  useDelayEffect(() => {
    console.debug('[adaptr][datalist] low-pass filter, filter:', filter);
    setPagination((prev) => ({...prev, ['page']: 0}));
    callbackRefreshSearch();
  }, [filter]);

  // active search on pagination change
  useEffect(() => {
    callbackRefreshSearch();
  }, [pagination.page, pagination.pageSize]);

  // active search on pagination change, or by handler
  useDelayEffect(() => {
    console.debug('[adaptr][datalist] search, filter:', filter, 'pagination:', pagination);
    let condition = {};
    if (filter.items.length > 0) {
      filter.items.forEach((item) => {
        condition = onBuildCondition(condition, item);
      });
    }

    console.log('[adaptr][datalist] paginate searching, condition:', JSON.stringify(condition));
    setData((prev) => ({...prev, ['isLoading']: true}));
    const promiseResponse = onSearch(
      pagination.page * pagination.pageSize,
      pagination.pageSize,
      condition);
    promiseResponse.then((response) => {
      console.log('[adaptr][datalist] paginate searched', response.total_num);
      setData((prev) => ({
        ...prev,
        'rows': response.data,
        'totalRows': response.total_num,
        'hasNextPage': (pagination.page + 1) * pagination.pageSize < response.total_num,
        'isLoading': false
      }));
    });
  }, [refreshSearch], 500);

  // delete row
  const handleRowDelete = (rowId: GridRowId) => () => {
    console.log('[adaptr][datalist] delete item, itemId:', rowId);
    onRowDelete(rowId);
    callbackRefreshSearch();
  };

  // component switch
  let slots = undefined
  let slotProps = undefined
  if (componentConfig?.filterable === 'toolbar') {
    const dataFilter = MyDataFilter()
    slots = dataFilter.slots
    slotProps = dataFilter.slotProps
  }

  return (
    <Paper sx={{height: 400, width: '100%'}}>
      <DataGrid
        sx={{border: 0}}

        columns={[...columns, ColumnAction(handleRowDelete)]}
        rows={data.rows}
        loading={data.isLoading}

        slots={slots}
        slotProps={slotProps}
        filterMode='server'
        onFilterModelChange={handleFilterChange}

        rowCount={rowCount}
        paginationModel={pagination}
        paginationMode='server'
        pageSizeOptions={pageSizeOptions}
        onPaginationModelChange={setPagination}

        initialState={{
          pagination: {
            paginationModel: {
              page: pagination.page,
              pageSize: pagination.pageSize
            },
            rowCount: rowCount,
            meta: {hasNextPage: data.hasNextPage}
          }
        }}

        onRowClick={onRowClick}
      />
    </Paper>
  );
}

export default MyDataList;