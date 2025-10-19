export interface IColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface SortState {
  key: string;
  direction: 'asc' | 'desc' | null;
}

export interface IClickItemValue {
  row: unknown;
  index: number;
}

export interface ITableProps<T> {
  columns: IColumn[];
  rows: (T & { id: string })[];
  striped?: boolean;
  hover?: boolean;
  actions?: boolean;
  clickableItem?: boolean;
}
