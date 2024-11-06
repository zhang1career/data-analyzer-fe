import * as React from 'react';
import {useEffect, useState} from 'react';
import {DataGrid, GridColDef, GridEventListener, GridFilterItem, GridFilterModel, GridRowId,} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import {Page} from "../models/Page.ts";
import MyDataFilter from "./MyDataFilter.tsx";
import {ColumnAction} from "./MyDataColumn.tsx";
import {DelayExec} from "../utils/DelayUtil.ts";

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
  onSearch: (offset: number, count: number, condition?: { [key: string]: string|number }) => Promise<Page<T>>;
  onBuildCondition: (originCondition: { [key: string]: any }, item: GridFilterItem) => { [key: string]: any };
  pageSizeOptions?: number[];
  onRowDelete?: (rowId: GridRowId) => () => void;
  onRowClick?: GridEventListener<'rowClick'>;
  componentConfig?: ComponentConfig;
}

const MyDataList: React.FC<DataTableProps<any>> = <T, >({
                                                          columns,
                                                          onSearch,
                                                          onBuildCondition,
                                                          pageSizeOptions = [10, 20, 50, 100],
                                                          onRowDelete = (rowId) => () => {
                                                            console.log('Row deleted, rowId:', rowId);
                                                          },
                                                          onRowClick = (params, event, detail) => {
                                                            console.log('Row clicked, {params, event, detail}:', {
                                                              params,
                                                              event,
                                                              detail
                                                            });
                                                          },
                                                          componentConfig = {
                                                            filterable: undefined
                                                          }
                                                        }: DataTableProps<T>) => {
  // active search handler
  const [activeSearchAt, setActiveSearchAt] = useState(Date.now());

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
  DelayExec(() => {
    console.log('Filter changed, filter:', filter);
    setPagination((prev) => ({...prev, ['page']: 0}));
    setActiveSearchAt(Date.now());
  }, [filter]);

  // active search on pagination change
  useEffect(() => {
    setActiveSearchAt(Date.now());
  }, [pagination.page, pagination.pageSize]);

  // active search on pagination change, or by handler
  DelayExec(() => {
    // console.log('Page searching, filter, pagination:', {filter, pagination});
    let condition = {};
    if (filter.items.length > 0) {
      filter.items.forEach((item) => {
        condition = onBuildCondition(condition, item);
      });
    }

    console.log('Page searching, condition:', {condition});
    setData((prev) => ({...prev, ['isLoading']: true}));
    const promisePage = onSearch(
      pagination.page * pagination.pageSize,
      pagination.pageSize,
      condition);
    promisePage.then((res) => {
      console.log('Page searched', res.total_num);
      setData((prev) => ({
        ...prev,
        'rows': res.data,
        'totalRows': res.total_num,
        'hasNextPage': (pagination.page + 1) * pagination.pageSize < res.total_num,
        'isLoading': false
      }));
    });
  }, [activeSearchAt], 500);

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

        columns={[...columns, ColumnAction(onRowDelete)]}
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