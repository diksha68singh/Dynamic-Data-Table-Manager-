import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material';
import {
  ViewColumn,
  FileUpload,
  FileDownload,
  Brightness4,
  Brightness7,
  Add
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { toggleTheme, addRow } from '../store/tableSlice';
import { exportToCSV } from '../utils/csvUtils';
import { generateId } from '../utils/tableUtils';
import ManageColumnsModal from './ManageColumnsModal';
import ImportCSVModal from './ImportCSVModal';

const Toolbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, columns, theme } = useAppSelector(state => state.table);
  
  const [manageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [importCSVOpen, setImportCSVOpen] = useState(false);

  const handleExportCSV = () => {
    const filename = `table_export_${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(data, columns, filename);
  };

  const handleAddRow = () => {
    const newRow = {
      id: generateId(),
      name: '',
      email: '',
      age: 0,
      role: '',
      department: '',
      location: ''
    };
    dispatch(addRow(newRow));
  };

  return (
    <>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
        p: 2,
        backgroundColor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1
      }}>
        <Typography variant="h4" component="h1">
          Data Table Manager
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title="Add New Row">
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddRow}
              size="small"
            >
              Add Row
            </Button>
          </Tooltip>

          <Tooltip title="Manage Columns">
            <IconButton 
              onClick={() => setManageColumnsOpen(true)}
              color="primary"
            >
              <ViewColumn />
            </IconButton>
          </Tooltip>

          <Tooltip title="Import CSV">
            <IconButton 
              onClick={() => setImportCSVOpen(true)}
              color="primary"
            >
              <FileUpload />
            </IconButton>
          </Tooltip>

          <Tooltip title="Export CSV">
            <IconButton 
              onClick={handleExportCSV}
              color="primary"
            >
              <FileDownload />
            </IconButton>
          </Tooltip>

          <Tooltip title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton 
              onClick={() => dispatch(toggleTheme())}
              color="primary"
            >
              {theme === 'light' ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <ManageColumnsModal 
        open={manageColumnsOpen}
        onClose={() => setManageColumnsOpen(false)}
      />

      <ImportCSVModal
        open={importCSVOpen}
        onClose={() => setImportCSVOpen(false)}
      />
    </>
  );
};

export default Toolbar;
