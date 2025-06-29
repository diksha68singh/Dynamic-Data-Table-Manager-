import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Checkbox,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';
import {
  ArrowUpward,
  ArrowDownward,
  Edit,
  Delete,
  Save,
  Cancel
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  setSortConfig,
  setCurrentPage,
  setRowsPerPage,
  deleteRow,
  saveAllEditing,
  cancelAllEditing,
  startEditing
} from '../store/tableSlice';
import { filterData, sortData, paginateData } from '../utils/tableUtils';
import EditableTableCell from './EditableTableCell';

const DataTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    data,
    columns,
    searchQuery,
    sortConfig,
    currentPage,
    rowsPerPage,
    editingRows
  } = useAppSelector(state => state.table);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<string | null>(null);

  const visibleColumns = columns.filter(col => col.visible);
  const filteredData = filterData(data, searchQuery);
  const sortedData = sortData(filteredData, sortConfig);
  const paginatedData = paginateData(sortedData, currentPage, rowsPerPage);

  const hasEditingRows = Object.keys(editingRows).length > 0;

  const handleSort = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column?.sortable) return;

    const newDirection = 
      sortConfig?.field === columnId && sortConfig.direction === 'asc' 
        ? 'desc' 
        : 'asc';

    dispatch(setSortConfig({ field: columnId, direction: newDirection }));
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(setCurrentPage(newPage));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setRowsPerPage(parseInt(event.target.value, 10)));
  };

  const handleDeleteClick = (rowId: string) => {
    setRowToDelete(rowId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (rowToDelete) {
      dispatch(deleteRow(rowToDelete));
      setRowToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setRowToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleEditClick = (rowId: string) => {
    dispatch(startEditing(rowId));
  };

  const getSortIcon = (columnId: string) => {
    if (sortConfig?.field !== columnId) return null;
    return sortConfig.direction === 'asc' ? <ArrowUpward /> : <ArrowDownward />;
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {hasEditingRows && (
        <Box sx={{ p: 2, backgroundColor: 'action.hover', borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              {Object.keys(editingRows).length} row(s) being edited
            </Typography>
            <Button
              size="small"
              variant="contained"
              startIcon={<Save />}
              onClick={() => dispatch(saveAllEditing())}
            >
              Save All
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Cancel />}
              onClick={() => dispatch(cancelAllEditing())}
            >
              Cancel All
            </Button>
          </Box>
        </Box>
      )}

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Actions</TableCell>
              {visibleColumns.map(column => (
                <TableCell
                  key={column.id}
                  sortDirection={
                    sortConfig?.field === column.id ? sortConfig.direction : false
                  }
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: column.sortable ? 'pointer' : 'default'
                    }}
                    onClick={() => handleSort(column.id)}
                  >
                    {column.label}
                    {column.sortable && getSortIcon(column.id)}
                    {column.required && (
                      <Chip label="Required" size="small" sx={{ ml: 1 }} />
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map(row => (
              <TableRow
                key={row.id}
                hover
                sx={{
                  backgroundColor: editingRows[row.id] ? 'action.hover' : 'inherit'
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(row.id)}
                      disabled={!!editingRows[row.id]}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(row.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
                {visibleColumns.map(column => (
                  <EditableTableCell
                    key={`${row.id}-${column.id}`}
                    rowId={row.id}
                    column={column}
                    value={row[column.id]}
                  />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this row? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default DataTable;
