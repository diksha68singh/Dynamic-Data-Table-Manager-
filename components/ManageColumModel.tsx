import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Divider
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { toggleColumnVisibility, addColumn } from '../store/tableSlice';
import { TableColumn } from '../types';
import { generateId } from '../utils/tableUtils';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ManageColumnsModal: React.FC<Props> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const { columns } = useAppSelector(state => state.table);
  
  const [newColumn, setNewColumn] = useState({
    label: '',
    type: 'text' as const
  });

  const handleToggleColumn = (columnId: string) => {
    dispatch(toggleColumnVisibility(columnId));
  };

  const handleAddColumn = () => {
    if (newColumn.label.trim()) {
      const column: TableColumn = {
        id: newColumn.label.toLowerCase().replace(/\s+/g, '_'),
        label: newColumn.label,
        type: newColumn.type,
        visible: true,
        sortable: true,
        editable: true
      };
      
      dispatch(addColumn(column));
      setNewColumn({ label: '', type: 'text' });
    }
  };

  const handleClose = () => {
    setNewColumn({ label: '', type: 'text' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Manage Columns</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Column Visibility
          </Typography>
          {columns.map(column => (
            <FormControlLabel
              key={column.id}
              control={
                <Checkbox
                  checked={column.visible}
                  onChange={() => handleToggleColumn(column.id)}
                />
              }
              label={column.label}
            />
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Add New Column
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Column Name"
              value={newColumn.label}
              onChange={(e) => setNewColumn({ ...newColumn, label: e.target.value })}
              variant="outlined"
              size="small"
              fullWidth
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={newColumn.type}
                label="Type"
                onChange={(e) => setNewColumn({ ...newColumn, type: e.target.value as any })}
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="email">Email</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button
            variant="contained"
            onClick={handleAddColumn}
            disabled={!newColumn.label.trim()}
            size="small"
          >
            Add Column
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageColumnsModal;
