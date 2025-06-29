import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setData } from '../store/tableSlice';
import { parseCSV } from '../utils/csvUtils';
import { ImportResult } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ImportCSVModal: React.FC<Props> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const { columns } = useAppSelector(state => state.table);
  
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const importResult = await parseCSV(file, columns);
      setResult(importResult);

      if (importResult.success && importResult.data) {
        dispatch(setData(importResult.data));
      }
    } catch (error) {
      setResult({
        success: false,
        errors: [{
          row: 0,
          field: '',
          value: '',
          message: 'Failed to parse CSV file'
        }]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    onClose();
  };

  const handleConfirm = () => {
    if (result?.success) {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Import CSV</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Upload a CSV file with the following columns: Name, Email, Age, Role, Department, Location
          </Typography>
          
          <input
            accept=".csv"
            style={{ display: 'none' }}
            id="csv-file-input"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="csv-file-input">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ mt: 2, mb: 2 }}
            >
              Choose CSV File
            </Button>
          </label>

          {file && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Selected file: {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </Alert>
          )}
        </Box>

        {result && (
          <Box sx={{ mb: 2 }}>
            {result.success ? (
              <Alert severity="success">
                Successfully imported {result.data?.length} rows!
              </Alert>
            ) : (
              <Box>
                <Alert severity="error" sx={{ mb: 2 }}>
                  Import failed with {result.errors?.length} errors:
                </Alert>
                <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
                  {result.errors?.map((error, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`Row ${error.row}: ${error.message}`}
                        secondary={`Field: ${error.field}, Value: "${error.value}"`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        {!result?.success && (
          <Button
            onClick={handleImport}
            disabled={!file || loading}
            variant="contained"
          >
            {loading ? <CircularProgress size={20} /> : 'Import'}
          </Button>
        )}
        {result?.success && (
          <Button onClick={handleConfirm} variant="contained">
            Confirm
          </Button>
        )}
      </DialogActions>
    </Dialog>
