import React, { useState, useEffect } from 'react';
import { TableCell, TextField, IconButton, Box } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { 
  startEditing, 
  updateEditingRow, 
  saveEditingRow, 
  cancelEditing 
} from '../store/tableSlice';
import { TableColumn } from '../types';

interface Props {
  rowId: string;
  column: TableColumn;
  value: any;
}

const EditableTableCell: React.FC<Props> = ({ rowId, column, value }) => {
  const dispatch = useAppDispatch();
  const { editingRows } = useAppSelector(state => state.table);
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [error, setError] = useState('');

  const editingRow = editingRows[rowId];
  const currentValue = editingRow ? editingRow[column.id] : value;

  useEffect(() => {
    setTempValue(currentValue);
  }, [currentValue]);

  const handleDoubleClick = () => {
    if (column.editable) {
      setIsEditing(true);
      if (!editingRow) {
        dispatch(startEditing(rowId));
      }
    }
  };

  const validateValue = (val: any): string => {
    if (column.required && (!val || val.toString().trim() === '')) {
      return `${column.label} is required`;
    }

    if (!val || val.toString().trim() === '') return '';

    switch (column.type) {
      case 'number':
        if (isNaN(Number(val))) {
          return `${column.label} must be a valid number`;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val.toString())) {
          return `${column.label} must be a valid email address`;
        }
        break;
    }
    return '';
  };

  const handleSave = () => {
    const validationError = validateValue(tempValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    const processedValue = column.type === 'number' ? Number(tempValue) : tempValue;
    dispatch(updateEditingRow({
      id: rowId,
      data: { [column.id]: processedValue }
    }));
    
    setIsEditing(false);
    setError('');
  };

  const handleCancel = () => {
    setTempValue(currentValue);
    setIsEditing(false);
    setError('');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            size="small"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyPress}
            error={!!error}
            helperText={error}
            type={column.type === 'number' ? 'number' : 'text'}
            autoFocus
            fullWidth
          />
          <IconButton size="small" onClick={handleSave} color="primary">
            <CheckIcon />
          </IconButton>
          <IconButton size="small" onClick={handleCancel} color="secondary">
            <CloseIcon />
          </IconButton>
        </Box>
      </TableCell>
    );
  }

  return (
    <TableCell 
      onDoubleClick={handleDoubleClick}
      sx={{ 
        cursor: column.editable ? 'pointer' : 'default',
        backgroundColor: editingRow ? 'action.hover' : 'transparent'
      }}
    >
      {currentValue || ''}
    </TableCell>
  );
};

export default EditableTableCell;
