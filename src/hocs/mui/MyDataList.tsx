import * as React from 'react';
import {useEffect, useState} from 'react';
import {DataGrid, GridColDef, GridEventListener, GridFilterItem, GridFilterModel, GridRowId} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import MyDataFilter from "@/hocs/mui/MyDataFilter.tsx";
import {ColumnAction} from "@/hocs/mui/datagrid/MyDataColumn.tsx";
import {useDelayEffect} from "@/utils/DelayUtil.ts";
import {Paginate} from "@/models/Paginate.ts";

// input type
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

interface DataTableProps<V, M> {
  columns: GridColDef[];
  onSearch: (offset: number, count: number, condition?: { [key: string]: string | number }) => Promise<Paginate<V>>;
  onBuildCondition: (originCondition: { [key: string]: any }, item: GridFilterItem) => { [key: string]: any };
  onMappingBatch: (v: V[]) => M[];
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
 * @param onMappingBatch
 * @param pageSizeOptions
 * @param onRowDelete
 * @param onRowClick
 * @param componentConfig
 * @param refreshSearch refresh search
 * @param callbackRefreshSearch callback refresh search
 * @constructor
 */
const MyDataList: React.FC<DataTableProps<any, any>> = <V, M, >({
                                                                  columns,
                                                                  onSearch,
                                                                  onBuildCondition,
                                                                  onMappingBatch,
                                                                  pageSizeOptions = [10, 20, 50, 100],
                                                                  onRowClick = (params, event, detail) => {
                                                                    console.log('[adaptr][datagrid] row clicked, {params, event, detail}:', {
                                                                      params,
                                                                      event,
                                                                      detail
                                                                    });
                                                                  },
                                                                  onRowDelete = (rowId: GridRowId) => () => {
                                                                    console.warn('[adaptr][datagrid] onRowDelete not implemented');
                                                                  },
                                                                  componentConfig = {
                                                                    filterable: undefined
                                                                  },
                                                                  refreshSearch,
                                                                  callbackRefreshSearch = () => {
                                                                    console.warn('[adaptr][datagrid] callbackRefreshSearch not implemented');
                                                                  }
                                                                }: DataTableProps<V, M>) => {
  // filters
  const [filter, setFilter] = useState<GridFilterModel>({items: []});

  // pagination
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
  });

  // input
  const [data, setData] = useState<DataStateType<M>>({
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

  // filters change
  const handleFilterChange = React.useCallback((filterModel: GridFilterModel) => {
    setFilter({...filterModel});
  }, []);
  // typo delay on filters
  useDelayEffect(() => {
    console.debug('[adaptr][datagrid] low-pass filters, filters:', filter);
    setPagination((prev) => ({...prev, ['page']: 0}));
    callbackRefreshSearch();
  }, [filter]);

  // active search on pagination change
  useEffect(() => {
    callbackRefreshSearch();
  }, [pagination.page, pagination.pageSize]);

  // active search on pagination change, or by handler
  useDelayEffect(() => {
    console.debug('[adaptr][datagrid] search, filters:', filter, 'pagination:', pagination);
    let condition = {};
    if (filter.items.length > 0) {
      filter.items.forEach((item) => {
        condition = onBuildCondition(condition, item);
      });
    }

    console.log('[adaptr][datagrid] paginate searching, condition:', JSON.stringify(condition));
    setData((prev) => ({...prev, ['isLoading']: true}));
    const promiseResponse = onSearch(
      pagination.page * pagination.pageSize,
      pagination.pageSize,
      condition);
    promiseResponse.then((response) => {
      console.log('[adaptr][datagrid] paginate searched', response.total_num);
      setData((prev) => ({
        ...prev,
        rows: onMappingBatch(response.data),
        totalRows: response.total_num,
        hasNextPage: (pagination.page + 1) * pagination.pageSize < response.total_num,
        isLoading: false
      }));
    });
  }, [refreshSearch], 500);

  // delete row
  const handleRowDelete = (rowId: GridRowId) => () => {
    console.log('[adaptr][datagrid] delete item, itemId:', rowId);
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
    <Paper sx={{width: '100%'}}>
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