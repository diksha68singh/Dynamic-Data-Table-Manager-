import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TableState, TableRow, TableColumn, SortConfig } from '../types';

const defaultColumns: TableColumn[] = [
  { id: 'name', label: 'Name', type: 'text', visible: true, sortable: true, editable: true, required: true },
  { id: 'email', label: 'Email', type: 'email', visible: true, sortable: true, editable: true, required: true },
  { id: 'age', label: 'Age', type: 'number', visible: true, sortable: true, editable: true },
  { id: 'role', label: 'Role', type: 'text', visible: true, sortable: true, editable: true },
  { id: 'department', label: 'Department', type: 'text', visible: false, sortable: true, editable: true },
  { id: 'location', label: 'Location', type: 'text', visible: false, sortable: true, editable: true },
];

const sampleData: TableRow[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', age: 30, role: 'Developer' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', age: 28, role: 'Designer' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', age: 35, role: 'Manager' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', age: 32, role: 'Developer' },
  { id: '5', name: 'Charlie Davis', email: 'charlie@example.com', age: 29, role: 'Analyst' },
];

const initialState: TableState = {
  data: sampleData,
  columns: defaultColumns,
  searchQuery: '',
  sortConfig: null,
  currentPage: 0,
  rowsPerPage: 10,
  editingRows: {},
  theme: 'light'
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<TableRow[]>) => {
      state.data = action.payload;
      state.currentPage = 0;
    },
    addRow: (state, action: PayloadAction<TableRow>) => {
      state.data.push(action.payload);
    },
    updateRow: (state, action: PayloadAction<{ id: string; data: Partial<TableRow> }>) => {
      const index = state.data.findIndex(row => row.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...action.payload.data };
      }
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(row => row.id !== action.payload);
    },
    setColumns: (state, action: PayloadAction<TableColumn[]>) => {
      state.columns = action.payload;
    },
    toggleColumnVisibility: (state, action: PayloadAction<string>) => {
      const column = state.columns.find(col => col.id === action.payload);
      if (column) {
        column.visible = !column.visible;
      }
    },
    addColumn: (state, action: PayloadAction<TableColumn>) => {
      state.columns.push(action.payload);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 0;
    },
    setSortConfig: (state, action: PayloadAction<SortConfig | null>) => {
      state.sortConfig = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload;
      state.currentPage = 0;
    },
    startEditing: (state, action: PayloadAction<string>) => {
      const row = state.data.find(r => r.id === action.payload);
      if (row) {
        state.editingRows[action.payload] = { ...row };
      }
    },
    updateEditingRow: (state, action: PayloadAction<{ id: string; data: Partial<TableRow> }>) => {
      if (state.editingRows[action.payload.id]) {
        state.editingRows[action.payload.id] = {
          ...state.editingRows[action.payload.id],
          ...action.payload.data
        };
      }
    },
    saveEditingRow: (state, action: PayloadAction<string>) => {
      const editingRow = state.editingRows[action.payload];
      if (editingRow) {
        const index = state.data.findIndex(row => row.id === action.payload);
        if (index !== -1) {
          state.data[index] = editingRow;
        }
        delete state.editingRows[action.payload];
      }
    },
    cancelEditing: (state, action: PayloadAction<string>) => {
      delete state.editingRows[action.payload];
    },
    saveAllEditing: (state) => {
      Object.keys(state.editingRows).forEach(id => {
        const editingRow = state.editingRows[id];
        const index = state.data.findIndex(row => row.id === id);
        if (index !== -1) {
          state.data[index] = editingRow;
        }
      });
      state.editingRows = {};
    },
    cancelAllEditing: (state) => {
      state.editingRows = {};
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    }
  }
});

export const {
  setData,
  addRow,
  updateRow,
  deleteRow,
  setColumns,
  toggleColumnVisibility,
  addColumn,
  setSearchQuery,
  setSortConfig,
  setCurrentPage,
  setRowsPerPage,
  startEditing,
  updateEditingRow,
  saveEditingRow,
  cancelEditing,
  saveAllEditing,
  cancelAllEditing,
  toggleTheme
} = tableSlice.actions;

export default tableSlice.reducer;
